const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();

const sequelize = require("../../config/dbConnect");

const Staff = require("../../models/staff");
//员工注册
router.post("/register", (req, res) => {
    const staff = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(staff.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
            }
            Staff
                .create({
                    id_number: staff.id_number,
                    password: hash,
                    staff_phone: staff.staff_phone,
                    name: staff.name,
                    identity:staff.identity
                })
                .then(() => {
                    res.json({
                        success: true,
                        msg: "注册成功！"
                    });
                })
                .catch(function(err) {
                    console.log (err);
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
    Staff
        .findOne({
            where: {
                staff_phone
            }
        })
        .then(result => {
            if (!result) {
                return res.json({ success: false, msg: "用户不存在！" });
            } else {
                console.log (result);
                bcrypt.compare(password, result.password).then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id_number: result.id_number,
                            staff_phone: result.staff_phone,
                            name: result.name,
                            identity: result.identity
                        };
                        //token 时长10分钟
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



module.exports = router;
