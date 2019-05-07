const express = require("express");
const router = express.Router();

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const BookInfo = require("../../models/book_info");
//图书查询
router.get("/find", (req, res) => {
  const keywords = req.query.input;
  const select = req.query.select;
  BookInfo.findAll({
    attributes: ["ssh", "ztm", "zrz", "cbs", "datestr", "content"],
    where: {
      [select]: {
        [Op.like]: "%" + keywords + "%"
      }
    }
  }).then(result => {
    if (result.length) {
      res.json({
        success: true,
        msg: "查找成功",
        data: result
      });
    } else {
      res.json({
        success: false,
        msg: "暂无图书"
      });
    }
  });
});
module.exports = router;
