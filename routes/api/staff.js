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
const BookInfo = require("../../models/book_info");
const BookReservate = require("../../models/book_reservate");
const TopCategory = require("../../models/top_category");
const BookCompensation = require("../../models/book_compensation");

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

//获取用户信息
router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req);
    Staff.findOne({
      where: {
        id_number: req.user.id_number
      }
    }).then(result => {
      res.json(result);
    });
  }
);

//更新用户信息 手机号 或者 邮箱
router.post(
  "/updateStaff",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staffInfo = req.body;
    Staff.update(
      {
        phone: staffInfo.phone
      },
      {
        where: {
          id_number: staffInfo.id_number
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
      let staff = req.body;
      console.log (req.user.id_number);
      Staff
          .findOne({
            where: {
              id_number: req.user.id_number
            }
          })
          .then(result => {
            bcrypt.compare(staff.password, result.password).then(isMatch => {
              if (isMatch) {
                bcrypt.genSalt(10, function(err, salt) {
                  bcrypt.hash(staff.pass, salt, (err, hash) => {
                    if (err) {
                      console.log(err);
                    }
                    Staff
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
                book_label
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
                      book_label,
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
                        book_label,
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
          } else if (result.status === "交罚金") {
            throw new Error("读者号上有处罚金，请前往服务台缴纳！");
          } else if (result.status === "吊销期") {
            throw new Error("读者证已吊销，时间尚未结束！");
          } else if (result.loss === 1) {
            throw new Error("读者证已挂失，请读者前去服务台取消挂失！");
          }
        });
      })
      .then(result => {
        res.json({
          success: true,
          msg: "借阅成功！"
        });
      })
      .catch(err => {
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
  passport.authenticate("jwt", { session: false }),
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
          if (result) {
            const reader_number = result.reader_number;
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
                  );
                });
              });
            }
          } else {
            throw new Error("该书尚未借阅，无需归还！");
          }
        });
      })
      .then(() => {
        res.json({
          success: true,
          msg: isOverdue ? "逾期归还成功！" : "归还成功！"
        });
      })
      .catch(err => {
        console.log(err);
        res.json({
          success: false,
          msg: err.message
        });
      });
  }
);

//新书入库
router.post(
  "/newBookStorage",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const bookInfo = req.body;
    return sequelize
      .transaction(function(t) {
        return BookInfo.findOne({
          where: {
            ssh: bookInfo.ssh
          },
          transaction: t
        }).then(result => {
          if (!result) {
            return TopCategory.findOne({
              where: {
                classify_id: bookInfo.ssh[0]
              }
            }).then(result => {
              console.log(result);
              return BookInfo.create(
                {
                  ssh: bookInfo.ssh,
                  ztm: bookInfo.ztm,
                  zrz: bookInfo.zrz,
                  isbn: bookInfo.isbn,
                  price: bookInfo.price,
                  cbs: bookInfo.cbs,
                  datestr: bookInfo.datestr,
                  content: bookInfo.content,
                  category_id: result.id,
                  pages: bookInfo.pages,
                  reserve: bookInfo.reserve
                },
                {
                  transaction: t
                }
              ).then(result => {
                console.log(result);
              });
            });
          } else {
            throw new Error("该图书已存在！");
          }
        });
      })
      .then(result => {
        // Transaction 会自动提交
        // console.log(result.length)
        console.log(result);
        res.json({
          success: true,
          msg: "入库成功！"
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

// 读者注册
router.post("/registerReader", (req, res) => {
  const reader = req.body;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("00000000", salt, (err, hash) => {
      if (err) {
        console.log(err);
      }
      User.create({
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

//重置读者密码
router.post(
  "/resetReaderPassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id_number = req.body.id_number;
    User.findOne({
      where: {
        id_number
      }
    }).then(result => {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("00000000", salt, (err, hash) => {
          if (err) {
            console.log(err);
          }
          User.update({ password: hash }, { where: { id_number } })
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
    });
  }
);

//注销读者
router.post(
  "/deleteReader",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id_number = req.body.id_number;
    User.findOne({
      where: {
        id_number
      }
    }).then(result => {
      if (!result) {
        res.json({
          success: false,
          msg: "查无此人！销户失败！"
        });
      }

      if (result.status === "交罚金") {
        res.json({
          success: false,
          msg: "读者证尚有罚金未缴纳，请先缴纳！销户失败！"
        });
      }
      if (result.status === "吊销期") {
        res.json({ success: false, msg: "读者处于吊销期，销户失败！" });
      }
      if (result.book_number !== 5) {
        res.json({ success: false, msg: "读者尚有图书暂未归还，销户失败！" });
      }
      //6 * 30 * 24 * 3600 * 1000
      if (new Date() - result.create_time < 15552000000) {
        res.json({
          success: false,
          msg: "读者办理借阅证尚未满6个月，销户失败！"
        });
      }
      if (result.loss === 1) {
        res.json({ success: false, msg: "读者证已挂失，销户失败！" });
      }
      return sequelize.transaction(function(t) {
        return BookStorage.update(
          { reservation: 0, appointment_of_reader_number: null },
          {
            where: {
              appointment_of_reader_number: id_number
            },
            transaction: t
          }
        )
          .then(() => {
            return User.destroy({
              where: {
                id_number
              },
              transaction: t
            }).then(() => {
              res.json({ success: true, msg: "销户成功！请退押金！" });
            });
          })
          .catch(err => {
            res.json({
              success: false,
              msg: err.message
            });
          });
      });
    });
  }
);

// 查询读者信息
router.post(
  "/viewReaderInformation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id_number = req.body.id_number;
    User.findOne({
      where: {
        id_number
      }
    }).then(result => {
      if (result) {
        res.json({
          success: true,
          data: result
        });
      } else {
        res.json({
          success: false,
          msg: "查无此人！"
        });
      }
    });
  }
);

// 读者 挂失
router.post(
    "/reportLoss",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id_number = req.body.id_number;
      const name = req.body.name;
      User.findOne({
        where: {
          id_number,
          name
        }
      }).then(result => {
        if (result) {
          User.update({ loss: 1 }, { where: { id_number } })
              .then(result => {
                if (result[0] === 1) {
                  res.json({ success: true, msg: "挂失成功！" });
                } else if (result[0] === 0) {
                  res.json({ success: false, msg: "挂失失败！" });
                }
              })
              .catch(err => {
                console.log(err);
              });
        } else {
          res.json({
            success: false,
            msg: "查无此人！"
          });
        }
      });
    }
);

// 读者 解除挂失
router.post(
    "/releaseTheLoss",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      const id_number = req.body.id_number;
      const name = req.body.name;
      User.findOne({
        where: {
          id_number,
          name
        }
      }).then(result => {
        if (result) {
          User.update({ loss: 0 }, { where: { id_number } })
              .then(result => {
                if (result[0] === 1) {
                  res.json({ success: true, msg: "解除挂失成功！" });
                } else if (result[0] === 0) {
                  res.json({ success: false, msg: "解除挂失失败！" });
                }
              })
              .catch(err => {
                console.log(err);
              });
        } else {
          res.json({
            success: false,
            msg: "查无此人！"
          });
        }
      });
    }
);

module.exports = router;
