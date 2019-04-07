const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

const sequelize = require("../../config/dbConnect");

const Staff = require("../../models/staff");
const User = require("../../models/user");
const BookBorrow = require("../../models/book_borrow");
const BookReturn = require("../../models/book_return");
const BookStorage = require("../../models/book_storage");
const BookReservate = require("../../models/book_reservate");

//员工注册
router.post("/register", (req, res) => {
  const staff = req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(staff.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }
      Staff.create({
        id_number: staff.id_number,
        password: hash,
        staff_phone: staff.staff_phone,
        name: staff.name,
        identity: staff.identity
      })
        .then(() => {
          res.json({
            success: true,
            msg: "注册成功！"
          });
        })
        .catch(function(err) {
          console.log(err);
          if (err.parent.errno === 1062) {
            res.json({
              success: false,
              msg: "用户已注册！"
            });
          }
        });
    });
  });
});

//员工登录
router.post("/login", (req, res) => {
  let staff_phone = req.body.staff_phone;
  let password = req.body.password;
  Staff.findOne({
    where: {
      staff_phone
    }
  }).then(result => {
    if (!result) {
      return res.json({ success: false, msg: "用户不存在！" });
    } else {
      bcrypt.compare(password, result.password).then(isMatch => {
        if (isMatch) {
          const rule = {
            id_number: result.id_number,
            staff_phone: result.staff_phone,
            name: result.name,
            identity: result.identity
          };
          //token 时长8小时
          jwt.sign(rule, "secret", { expiresIn: 8 * 3600 }, (err, token) => {
            if (err) {
              console.log(err);
            }
            res.json({
              success: true,
              token: "Bearer " + token,
              msg: "登录成功！"
            });
          });
        } else {
          return res.json({ success: false, msg: "密码错误！" });
        }
      });
    }
  });
});

//图书借阅
router.post(
  "/borrowingBook",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reader_number = req.body.reader_number;
    let book_label = req.body.book_label;

    return sequelize
      .transaction(function(t) {
        return User.findOne({
          where: {
            id_number: reader_number
          },
          transaction: t
        }).then(result => {
          if (result.status === "正常") {
            return BookStorage.findOne({
              where: {
                label: book_label
                // status: '在库'
              },
              transaction: t
            }).then(result => {
              if (result.status === "在库") {
                return BookStorage.update(
                  {
                    status: "借出"
                  },
                  {
                    where: {
                      label: book_label,
                      status: "在库"
                    },
                    transaction: t //注意（事务transaction 须和where同级）second parameter is "options", so transaction must be in it
                  }
                ).then(() => {
                  return BookBorrow.create(
                    {
                      reader_number,
                      book_label,
                      borrow_time: new Date(),
                      should_still_return_time:
                        new Date().getTime() + 30 * 24 * 3600 * 1000
                    },
                    {
                      transaction: t
                    }
                  );
                });
              } else if (result.status === "已预约") {
                if (result.appointment_of_reader_number === reader_number) {
                  return BookStorage.update(
                    {
                      status: "借出",
                      appointment_of_reader_number: null
                    },
                    {
                      where: {
                        label: book_label,
                        status: "已预约"
                      },
                      transaction: t //注意（事务transaction 须和where同级）second parameter is "options", so transaction must be in it
                    }
                  )
                    .then(() => {
                      return BookBorrow.create(
                        {
                          reader_number,
                          book_label,
                          borrow_time: new Date(),
                          should_still_return_time:
                            new Date().getTime() + 30 * 24 * 3600 * 1000
                        },
                        {
                          transaction: t
                        }
                      );
                    })
                    .then(() => {
                      return BookReservate.destroy({
                        where: {
                          reader_number,
                          book_label
                        },
                        transaction: t
                      });
                    });
                } else {
                  throw new Error("该图书已预约");
                }
              } else if (result.status === "库本") {
                throw new Error("库本不可借");
              } else {
                throw new Error("该图书已借出");
              }
            });
          } else if (result.status === "挂失") {
            throw new Error("读者证已挂失，请读者前去服务台取消挂失！");
          } else if (result.status === "交罚金") {
            throw new Error("读者号上有处罚金，请前往服务台缴纳！");
          } else if (result.status === "吊销期") {
            throw new Error("读者证已吊销，时间尚未结束！");
          }
        });
      })
      .then(result => {
        // Transaction 会自动提交
        // console.log(result.length)
        console.log(result);
        res.json({
          success: true,
          msg: "借阅成功！"
        });
      })
      .catch(err => {
        // Transaction 会自动回滚
        // err 是事务回调中使用promise链中的异常结果
        console.log(err);
        res.json({
          success: false,
          msg: err.message
        });
      });
  }
);

//图书归还
router.post(
  "/returningBook",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let book_label = req.body.book_label;
    let isOverdue = false;

    return sequelize
      .transaction(function(t) {
        return BookBorrow.findOne({
          where: {
            book_label
          },
          transaction: t
        }).then(result => {
          const reader_number = result.reader_number;
          if (result) {
            const days = result.should_still_return_time - new Date();
            // console.log (days);
            if (days > 0) {
              //正常归还
              return BookReturn.create(
                {
                  reader_number,
                  book_label,
                  borrow_time: result.borrow_time,
                  return_time: new Date(),
                  status: "正常"
                },
                { transaction: t }
              ).then(() => {
                return BookBorrow.destroy({
                  where: {
                    reader_number,
                    book_label
                  },
                  transaction: t
                });
              });
            } else {
              //逾期
              isOverdue = true;
              return BookReturn.create(
                {
                  reader_number,
                  book_label,
                  borrow_time: result.borrow_time,
                  return_time: new Date(),
                  status: "逾期"
                },
                { transaction: t }
              ).then(() => {
                // console.log (result);
                return BookBorrow.destroy({
                  where: {
                    reader_number,
                    book_label
                  },
                  transaction: t
                }).then(() => {
                  User.update(
                    {
                      status: "吊销期",
                      end_time: +new Date() + 30 * 24 * 3600 * 1000
                    },
                    {
                      where: {
                        id_number: reader_number
                      }
                    }
                  )
                });
              });
            }
          } else {
            throw new Error("该书尚未借阅，无需归还！");
          }
        });
      })
      .then(() => {
        // Transaction 会自动提交
        // console.log(result.length)
        // console.log (result);
        res.json({
          success: true,
          msg: isOverdue ? "逾期归还成功！" : "归还成功！"
        });
      })
      .catch(err => {
        // Transaction 会自动回滚
        // err 是事务回调中使用promise链中的异常结果
        console.log(err);
        res.json({
          success: false,
          msg: err.message
        });
      });
  }
);

module.exports = router;
