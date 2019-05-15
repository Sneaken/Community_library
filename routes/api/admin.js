const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

const Admin = require("../../models/admin");
const Staff = require("../../models/staff");
const libraryInfo = require("../../models/library_info");

// 管理员登录接口
router.post("/login", (req, res) => {
  let loginForm = req.body;
  Admin.findOne({
    where: {
      username: loginForm.username
    }
  }).then(result => {
    if (!result) {
      return res.json({ success: false, msg: "用户不存在！" });
    } else {
      bcrypt.compare(loginForm.password, result.password).then(isMatch => {
        if (isMatch) {
          const rule = {
            username: result.username
          };
          //token 时长8小时
          jwt.sign(rule, "secret", { expiresIn: 8 * 3600 }, (err, token) => {
            if (err) {
              -console.log(err);
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
//职员注册
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff = req.body;
    bcrypt.genSalt(10, function(err, salt) {
      //初始密码为8个0
      bcrypt.hash("00000000", salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        Staff.findOne({
          where: {
            staff_phone: staff.staff_phone
          }
        }).then(result => {
          if (!result) {
            Staff.create({
              staff_phone: staff.staff_phone,
              id_number: staff.id_number,
              name: staff.name,
              password: hash,
              identity: staff.identity
            })
              .then(() => {
                res.json({
                  success: true,
                  msg: "注册成功！"
                });
              })
              .catch(err => {
                console.log(err);
                res.json({
                  success: false,
                  msg: err
                });
              });
          } else {
            res.json({
              success: false,
              msg: "职员已注册"
            });
          }
        });
      });
    });
  }
);
//返回职员列表
router.get(
  "/findStaff",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Staff.findAll({
      attributes: ["id_number"]
    })
      .then(result => {
        res.json({ success: true, msg: "", data: result });
      })
      .catch(error => {
        res.json({ success: false, msg: "职员注销失败！" + error });
      });
  }
);
// 职员注销
router.post(
  "/deleteStaff",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
      Staff.destroy({
      where: {
        id_number: req.body.id_number
      }
    })
      .then(result => {
        if (result === 1) {
          res.json({ success: true, msg: "职员注销成功！" });
        }
      })
      .catch(error => {
          res.json({ success: false, msg: "职员注销失败！" + error });
      });
  }
);

// 权限修改
router.post(
  "/staffChange",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const staff = req.body;
    Staff.update(
      {
        identity: staff.identity
      },
      {
        where: {
          id_number: staff.id_number
        }
      }
    )
      .then(result => {
        if (result[0] === 1) {
          res.json({ success: true, msg: "权限更改成功！" });
        } else {
          res.json({ success: false, msg: "未有任何改动！" });
        }
      })
      .catch(error => {
        res.json({ success: false, msg: "权限更改失败！" + error });
      });
  }
);

//图书馆公告信息发布
router.post(
  "/informationDevelopment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const info = req.body;
    libraryInfo
      .create({
        title: info.title,
        content: info.content
      })
      .then(() => {
        res.json({
          success: true,
          msg: "添加成功！"
        });
      })
      .catch(err => {
        console.log(err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
);

//修改图书挂公告信息
router.post(
  "/informationModification",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    libraryInfo
        .update(
            {
              content: req.body.content,
            },
            {
              where: {
                title: req.body.title
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
          res.json({
            success: false,
            msg: "修改失败,请重试！"
          });
        });
  }
);

//获取图书馆公告信息
router.post(
  "/findInformation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    libraryInfo
      .findOne({
        attributes: ["title", "content"],
        where: {
          title: req.body.title
        }
      })
      .then(result => {
        if (result) {
          res.json({
            success: true,
            msg: "添加成功！",
            data:result
          });
        } else {
          res.json({
            success: false,
            msg: '该标题下无内容！'
          });
        }
      })
      .catch(err => {
        res.json({
          success: false,
          msg: err
        });
      });
  }
);

//更改密码
router.post(
  "/changePassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const admin = req.body;
    Admin.findOne({
      where: {
        username: "admin"
      }
    }).then(result => {
      bcrypt.compare(admin.password, result.password).then(isMatch => {
        if (isMatch) {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(admin.pass, salt, (err, hash) => {
              if (err) {
                console.log(err);
              }
              Admin.update({ password: hash }, { where: { username: "admin" } })
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
module.exports = router;
