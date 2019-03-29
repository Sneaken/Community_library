const express = require ("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router ();

const sequelize = require("../../config/dbConnect");



// 增加管理员接口
router.post ("/register", (req, res) => {
    const staff = req.body;
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
                    // email: reader.email,
                    book_number: 5
                })
                .then(() => {
                    res.json({
                        success: true,
                        msg: "注册成功！"
                    });
                })
                .catch(function(err) {
                    // print the error details
                    // console.log (err);
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

//查找管理员接口
router.post ("/login", (req, res) => {
    let sql_name = $sql.admin.select_admin;
    sql_name += "where admin_number = ? and password = ?";
    let admin_number = req.body.admin_number;
    let password = req.body.password;
    const md5 = crypto.createHash ("md5");
    const newPassword = md5.update (password).digest ("hex"); //加密
    pool.getConnection (function (err, connection) {
        connection.query (sql_name, [admin_number, newPassword], function (
            err,
            result
        ) {
            if (err) {
                console.log (err);
            }
            if (result[0] === undefined) {
                res.send ("-1"); //查询不出username，data 返回-1
            } else {
                jsonWrite (res, "登录成功");
            }
            connection.release ();
        });
    });
});

//借书
router.post ("/borrow", (req, res) => {
    const sql_reader =
        'SELECT book_number, status FROM USER WHERE reader_number = ?';
    const sql_book = 'SELECT `状态` FROM book_storage WHERE label = ?';
    const params = req.body;

    pool.getConnection (function (err, connection) {
        connection.query (sql_book, [params.book_label], function (err, result) {
            if (err) {
                console.log (err);
            }
            if (result[0]['状态'] === '在库') {
                // console.log (result[0]['状态']);
                connection.query (sql_reader, [params.reader_number], function (err, result) {
                    if (err) {
                        console.log (err);
                    }
                    if (result[0] !== undefined) {
                        // console.log (result[0]);
                        if (result[0].book_number < 10 && result[0].status === "正常") {
                            const sql2 = $sql.admin.borrow;
                            const borrow = moment (new Date ()).format ('YYYY-MM-DD HH:mm:ss');
                            const restore = moment (new Date ().getTime () + 60 * 24 * 60 * 60 * 1000).format ('YYYY-MM-DD HH:mm:ss')
                            connection.query (
                                sql2,
                                [
                                    params.reader_number,
                                    params.book_label,
                                    borrow,
                                    restore
                                ],
                                function (err, result) {
                                    if (err) {
                                        console.log (err);
                                    }
                                    if (result.affectedRows === 1) {
                                        jsonWrite (res, "借阅成功");
                                    } else {
                                        jsonWrite (res, "借阅失败");
                                    }
                                }
                            )
                        } else if (result[0].book_number === 10) {
                            jsonWrite (res, "您借阅的图书已到上限");
                        } else if (result[0].status === "挂失") {
                            jsonWrite (res, "您的借阅卡已挂失，请先解除挂失。");
                        } else if (result[0].status === "交罚金") {
                            jsonWrite (res, "您上次借阅产生的逾期费尚未缴纳，请前去服务柜台缴纳");
                        }
                    }
                });
            } else if (result[0]['状态'] === '借出') {
                jsonWrite (res, "你所借阅的书籍已借出！");
            } else if (result[0]['状态'] === '库本') {
                jsonWrite (res, "你所借阅的书籍是库本！不可借！");
            } else {
                jsonWrite (res, "你所借阅的书籍不存在，请检查书标号！");
            }
            connection.release ();
        });

    });
});


//还书   还完删除借阅表的相关信息
router.post ("/return", (req, res) => {
    const sql_borrow_info = $sql.admin.borrow_info;
    const book_label = req.body.book_label;
    pool.getConnection (function (err, connection) {
        connection.query (
            sql_borrow_info,
            [
                book_label
            ],
            function (err, result) {
                if (err) {
                    console.log (err);
                }
                if (result[0] === undefined) {
                    res.send ("-1"); //查询不出data 返回-1
                } else {
                    //[0]['status'] === '正常'
                    if(result[0]['status'] === '正常'){
                        const sql_delete = 'select *  from book_borrow where book_label=?';
                        const sql_return = '';
                        connection.query (
                            sql_borrow_info,
                            [
                                book_label
                            ],
                            function (err, result) {
                                if (err) {
                                    console.log (err);
                                }
                                if (result[0] === undefined) {
                                    res.send ("-1"); //查询不出data 返回-1
                                } else {
                                    //[0]['status'] === '正常'
                                    if(result[0]['status'] === '正常'){

                                    }
                                    jsonWrite (res, "登录成功");
                                }
                                connection.release ();
                            }
                        );
                    }
                    jsonWrite (res, "登录成功");
                }
                connection.release ();
            }
        );
    });
});
module.exports = router;
