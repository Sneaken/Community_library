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

router.get("/getBookInfo", (req, res) => {
  const ssh = req.query.ssh;

  // BookInfo.hasMany(BookStorage, { foreignKey: "ssh" });
  // BookStorage.belongsTo(BookInfo, { foreignKey: "ssh" });
  //
  // BookStorage.hasOne(BookBorrow, { foreignKey: "book_label", as: 'should_still_return_time'});
  // BookBorrow.belongsTo(BookStorage, { foreignKey: "book_label" });
  // BookInfo.findAll({
  //   attributes: { exclude: ["reserve", "category_id"] },
  //   where: {
  //     ssh
  //   },
  //   include: [
  //     {
  //       model: BookStorage,
  //       attributes:{ exclude: ["ssh"] },
  //       include: [{model: BookBorrow,as: 'should_still_return_time',attributes: ['should_still_return_time']}],
  //       required: false
  //     }
  //   ]
  sequelize
    .query(
      "SELECT `book_info`.`ssh`, `book_info`.`ztm`, `book_info`.`zrz`, `book_info`.`isbn`, `book_info`.`price` , `book_info`.`cbs`, `book_info`.`datestr`, `book_info`.`content`, `book_info`.`pages`, `book_storages`.`book_label` , `book_storages`.`collection_place`, `book_storages`.`status`, `book_storages`.`appointment_of_reader_number`, `book_storages`.`reservation`, `book_storages->should_still_return_time`.`id` , `book_storages->should_still_return_time`.`should_still_return_time` FROM `book_info` `book_info` LEFT JOIN `book_storage` `book_storages` ON `book_info`.`ssh` = `book_storages`.`ssh` LEFT JOIN `book_borrow` `book_storages->should_still_return_time` ON `book_storages`.`book_label` = `book_storages->should_still_return_time`.`book_label` WHERE `book_info`.`ssh` = ?",
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
        let obj = {book_info};

        result.forEach(item => {
          if(item.book_label){
            let oo = {
              book_label: item.book_label,
              collection_place: item.collection_place,
              status: item.status,
              appointment_of_reader_number: item.appointment_of_reader_number,
              reservation: item.reservation,
              should_still_return_time: item.should_still_return_time
            };
            obj.book_info.book_storage.push(oo);
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
