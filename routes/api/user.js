const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

const sequelize = require("../../config/dbConnect");

const user = require("../../models/user");
const bookBorrow = require("../../models/book_borrow");
const bookInfo = require("../../models/book_info");
const bookStorage = require("../../models/book_storage");
const bookReturn = require("../../models/book_return");
const bookReservate = require("../../models/book_reservate");

// 注册用户
router.post("/register", (req, res) => {
  const reader = req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(reader.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      }
      user
        .create({
          id_number: reader.id_number,
          password: hash,
          phone: reader.phone,
          name: reader.name,
          deposit: 0.0,
          book_number: 5,
          create_time: new Date()
        })
        .then(() => {
          res.json({
            success: true,
            msg: "注册成功！"
          });
        })
        .catch(function(err) {
          // console.log(err);
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

//用户登录
router.post("/login", (req, res) => {
  let phone = req.body.phone;
  let password = req.body.password;
  user
    .findOne({
      where: {
        phone
      }
    })
    .then(result => {
      if (!result) {
        return res.json({ success: false, msg: "用户不存在！" });
      } else {
        bcrypt.compare(password, result.password).then(isMatch => {
          if (isMatch) {
            const rule = {
              id_number: result.id_number,
              phone: result.phone,
              name: result.name
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

//获取用户信息
router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    user
      .findOne({
        where: {
          id_number: req.user.id_number
        }
      })
      .then(result => {
        res.json(result);
      });
  }
);

//更新用户信息 手机号 或者 邮箱
router.post(
  "/updateUser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userInfo = req.body;
    user
      .update(
        {
          phone: userInfo.phone,
          email: userInfo.email
        },
        {
          where: {
            id_number: userInfo.id_number
          }
        }
      )
      .then(() => {
        res.json({
          success: true,
          msg: "修改成功！"
        });
      })
      .catch(error => {
        console.log(error);
        res.json({
          success: false,
          msg: "修改失败,请重试！"
        });
      });
  }
);

//更改密码
router.post(
  "/changePassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let reader = req.body;
    user
      .findOne({
        where: {
          id_number: req.user.id_number
        }
      })
      .then(result => {
        bcrypt.compare(reader.password, result.password).then(isMatch => {
          if (isMatch) {
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(reader.pass, salt, (err, hash) => {
                if (err) {
                  console.log(err);
                }
                // console.log(hash);
                user
                  .update(
                    { password: hash },
                    { where: { id_number: req.user.id_number } }
                  )
                  .then(result => {
                    if (result[0] === 1) {
                      res.json({ success: true, msg: "修改成功！" });
                    } else if (result[0] === 0) {
                      res.json({ success: false, msg: "修改失败！" });
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              });
            });
          } else {
            return res.json({ success: false, msg: "原密码错误！" });
          }
        });
      });
  }
);

//图书续借
router.post(
  "/renew",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    bookBorrow
      .findOne({
        where: {
          book_label: req.body.book_label,
          number_of_renewals: 0
        }
      })
      .then(result => {
        result
          .update(
            {
              number_of_renewals: 1,
              should_still_return_time:
                new Date().getTime() + 15 * 24 * 3600 * 1000
            },
            { where: { book_label: req.body.book_label } }
          )
          .then(() => {
            res.json({ success: true, msg: "续借成功！" });
          })
          .catch(error => {
            console.log(error);
            res.json({ success: false, msg: "续借失败！请重试！" });
          });
      })
      .catch(error => {
        console.log(error);
        res.json({ success: false, msg: "续借次数已达上限，续借失败！" });
      });
  }
);

//获取用户当前借阅图书
router.post(
  "/currentBorrowingBooks",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    sequelize
      .query(
        "SELECT book_borrow.book_label, book_info.ztm, book_borrow.borrow_time, book_borrow.should_still_return_time, book_borrow.renewal_time, book_borrow.number_of_renewals, book_borrow.`status` \n" +
          "FROM book_borrow, book_storage, book_info \n" +
          "WHERE book_borrow.reader_number = ?  AND book_borrow.book_label = book_storage.book_label AND book_storage.ssh = book_info.ssh",
        {
          replacements: [req.user.id_number],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.json({ success: false, msg: "" + err });
      });
  }
);

//借阅历史
router.post(
  "/borrowedHistory",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    sequelize
      .query(
        "SELECT book_return.book_label, book_info.ztm, book_return.borrow_time, book_return.return_time, book_return.`status` \n" +
          "FROM book_return, book_info, book_storage \n" +
          "WHERE book_return.reader_number = ?  AND book_storage.book_label = book_return.book_label AND book_storage.ssh = book_info.ssh",
        {
          replacements: [req.user.id_number],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.json({ success: false, msg: "" + err });
      });
  }
);

//逾期查询
router.post(
  "/overdueInquiry",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    sequelize
      .query(
        "SELECT book_return.book_label, book_info.ztm, book_return.borrow_time, book_return.return_time, book_return.`status` \n" +
          "FROM book_return, book_info, book_storage \n" +
          "WHERE book_return.reader_number = ?  AND book_return.status != '正常' AND book_storage.book_label = book_return.book_label AND book_storage.ssh = book_info.ssh",
        {
          replacements: [req.user.id_number],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.json({ success: false, msg: "" + err });
      });
  }
);

// 图书赔偿
router.post(
  "/bookCompensation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    sequelize
      .query(
        "SELECT book_compensation.book_label, book_info.ztm, book_compensation.time, book_compensation.money, book_compensation.`status` \n" +
          "FROM book_compensation, book_info, book_storage \n" +
          "WHERE book_compensation.reader_number = ?  AND book_storage.book_label = book_compensation.book_label AND book_storage.ssh = book_info.ssh",
        {
          replacements: [req.user.id_number],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.json({ success: false, msg: "" + err });
      });
  }
);

//预约管理
router.post(
  "/bookReservationManagement",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    sequelize
      .query(
        "SELECT book_reservate.book_label,book_info.ztm,book_reservate.time_of_appointment,book_reservate.ending_time_of_appointment\n" +
          "FROM book_reservate, book_storage, book_info \n" +
          "WHERE book_reservate.reader_number = ?  AND book_reservate.book_label = book_storage.book_label AND book_storage.ssh = book_info.ssh",
        {
          replacements: [req.user.id_number],
          type: sequelize.QueryTypes.SELECT
        }
      )
      .then(result => {
        res.json({ success: true, msg: "预约查询成功！", data: result });
      })
      .catch(err => {
        res.json({ success: false, msg: "预约查询失败！" + err });
      });
  }
);

//图书预约
router.post(
  "/bookReservation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return sequelize.transaction(function(t) {
      return bookStorage
        .findOne({
          where: {
            book_label: req.body.book_label
          },
          transaction: t
        })
        .then(result => {
          if (result.status === "库本") {
            throw new Error("库本无法预约！");
          }

          if (result.reservation) {
            throw new Error("该图书已被预约！");
          }
          return bookReservate
            .create(
              {
                reader_number: req.user.id_number,
                book_label: req.body.book_label,
                time_of_appointment: new Date(),
                ending_time_of_appointment:
                  new Date().getTime() + 7 * 24 * 3600 * 1000
              },
              {
                transaction: t
              }
            )
            .then(() => {
              return bookStorage
                .update(
                  {
                    reservation: 1
                  },
                  {
                    where: {
                      book_label: req.body.book_label
                    },
                    transaction: t
                  }
                )
                .then(() => {
                  res.json({ success: true, msg: "预约成功！" });
                });
            });
        })
        .catch(err => {
          console.log(err);
          res.json({ success: false, msg: "预约失败！" + err.message });
        });
    });
  }
);

//取消图书预约
router.post(
  "/cancelRenewal",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return sequelize.transaction(function(t) {
      return bookReservate
        .destroy({
          where: {
            book_label: req.body.book_label,
            reader_number: req.user.id_number
          },
          transaction: t
        })
        .then(() => {
          return bookStorage
            .update(
              {
                reservation: 0
              },
              {
                where: {
                  book_label: req.body.book_label
                },
                transaction: t
              }
            )
            .then(() => {
              res.json({ success: true, msg: "取消预约成功！" });
            });
        })
        .catch(() => {
          res.json({ success: false, msg: "取消预约失败！请重试！" });
        });
    });
  }
);

module.exports = router;
