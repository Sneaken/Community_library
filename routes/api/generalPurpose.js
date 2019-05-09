const express = require("express");
const router = express.Router();
const sequelize = require("../../config/dbConnect");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const BookInfo = require("../../models/book_info");
const BookStorage = require("../../models/book_storage");
const BookBorrow = require("../../models/book_borrow");
//图书查询
router.get("/findBook", (req, res) => {
  const keywords = req.query.input;
  const select = req.query.select || "ztm";
  if (keywords === undefined) {
    return res.json({
      success: false,
      msg: "暂无图书"
    });
  }

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

//获取图书的详细信息
router.get("/getBookInfo", (req, res) => {
  const ssh = req.query.ssh;
  sequelize
    .query(
      "SELECT `book_info`.`ssh`, `book_info`.`ztm`, `book_info`.`zrz`, `book_info`.`isbn`, `book_info`.`price` , `book_info`.`cbs`, `book_info`.`datestr`, `book_info`.`content`, `book_info`.`pages`, `book_storage`.`book_label` , `book_storage`.`collection_place`, `book_storage`.`status`, `book_storage`.`reservation`, `book_borrow`.`should_still_return_time`, `book_reservate`.time_of_appointment , `book_reservate`.`ending_time_of_appointment` FROM `book_info` LEFT JOIN `book_storage` ON `book_info`.`ssh` = `book_storage`.`ssh` LEFT JOIN `book_borrow` ON `book_storage`.`book_label` = `book_borrow`.`book_label` LEFT JOIN `book_reservate` ON `book_borrow`.`book_label` = `book_reservate`.`book_label` WHERE `book_info`.`ssh` = ?",
      { replacements: [ssh], type: sequelize.QueryTypes.SELECT }
    )
    .then(result => {
      if (result) {
        let book_info = {
          ssh: result[0].ssh,
          ztm: result[0].ztm,
          zrz: result[0].zrz,
          isbn: result[0].isbn,
          price: result[0].price,
          cbs: result[0].cbs,
          content: result[0].content,
          pages: result[0].pages,
          book_storage: []
        };
        let obj = { book_info, book_reservate: [] };

        result.forEach(item => {
          if (item.book_label) {
            let oo = {
              book_label: item.book_label,
              collection_place: item.collection_place,
              status: item.status,
              reservation: item.reservation,
              should_still_return_time: item.should_still_return_time
            };
            obj.book_info.book_storage.unshift(oo);
            if (item.reservation) {
              let ox = {
                book_label: item.book_label,
                collection_place: item.collection_place,
                time_of_appointment: item.time_of_appointment,
                ending_time_of_appointment: item.ending_time_of_appointment
              };
              obj.book_reservate.unshift(ox);
            }
          }
        });
        res.json({
          success: true,
          msg: "查找成功",
          data: obj
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
