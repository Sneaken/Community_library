const express = require("express");
const router = express.Router();
const sequelize = require("../../config/dbConnect");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const BookInfo = require("../../models/book_info");
const libraryInfo = require("../../models/library_info");

//图书查询
router.get("/findBook", (req, res) => {
  const keywords = req.query.input; //关键字
  const select = req.query.select || "ztm"; //类别
  //未获取到关键字
  if (keywords === undefined) {
    return res.json({
      success: false,
      msg: "暂无图书"
    });
  }

  BookInfo.findAll({
    attributes: ["ssh", "ztm", "zrz", "cbs", "datestr", "content", "img_place"],
    where: {
      [select]: {
        [Op.like]: "%" + keywords + "%"
      }
    }
  }).then(result => {
    //查询到数据
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

//分类查找
router.get("/findBook2", (req, res) => {
  const keywords = req.query.input;
  if (keywords === undefined) {
    return res.json({
      success: false,
      msg: "暂无图书"
    });
  }

  BookInfo.findAll({
    attributes: ["ssh", "ztm", "zrz", "cbs", "datestr", "content", "img_place"],
    where: {
      category_id: keywords
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
      "SELECT `book_info`.`ssh`, `book_info`.`ztm`, `book_info`.`zrz`, `book_info`.`isbn`, `book_info`.`price` , `book_info`.`cbs`, `book_info`.`datestr`, `book_info`.`content`, `book_info`.`pages`,  `book_info`.`img_place`,`book_storage`.`book_label` , `book_storage`.`collection_place`, `book_storage`.`status`, `book_storage`.`reservation`, `book_borrow`.`should_still_return_time`, `book_reservate`.time_of_appointment , `book_reservate`.`ending_time_of_appointment` FROM `book_info` LEFT JOIN `book_storage` ON `book_info`.`ssh` = `book_storage`.`ssh` LEFT JOIN `book_borrow` ON `book_storage`.`book_label` = `book_borrow`.`book_label` LEFT JOIN `book_reservate` ON `book_storage`.`book_label` = `book_reservate`.`book_label` WHERE `book_info`.`ssh` = ?",
      { replacements: [ssh], type: sequelize.QueryTypes.SELECT }
    )
    .then(result => {
      if (result[0]) {
        let book_info = {
          ssh: result[0].ssh,
          ztm: result[0].ztm,
          zrz: result[0].zrz,
          datestr: result[0].datestr,
          isbn: result[0].isbn,
          price: result[0].price,
          cbs: result[0].cbs,
          content: result[0].content,
          pages: result[0].pages,
          img_place: result[0].img_place,
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
            obj.book_info.book_storage.push(oo);
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

router.post("/getClassifyContent", (req, res) => {
  //查询分类和子分类
  sequelize
    .query(
      "SELECT `top_category`.`id`,`top_category`.`classify_id`,`top_category`.`classify_name`, `subclassification`.`id` AS `sid`,`subclassification`.`sub_id`, `subclassification`.`sub_name` FROM `top_category` LEFT JOIN `subclassification` ON `top_category`.`classify_id` = `subclassification`.`top_id`",
      { type: sequelize.QueryTypes.SELECT }
    )
    .then(result => {
      //格式化输出
      let data = [];
      result.forEach(item => {
        data[item.id - 1] = {
          label: `${item.classify_id} ${item.classify_name}`,
          children: []
        };
      });
      result.forEach(item => {
        data[item.id - 1].children.push({
          label: `${item.sub_id} ${item.sub_name}`,
          id: item.sid
        });
      });

      res.json({ success: true, data, msg: "获取成功！" });
    })
    .catch(err => {
      res.json({ success: false, data, msg: "获取失败！" + err });
    });
});

//获取图书馆公告信息
router.get("/findInformation", (req, res) => {
  libraryInfo
    .findAll({
      attributes: ["title", "content"]
    })
    .then(result => {
      if (result) {
        res.json({
          success: true,
          msg: "获取成功！",
          data: result
        });
      } else {
        res.json({
          success: false,
          msg: "公告暂无消息！"
        });
      }
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err
      });
    });
});

//获取图书馆公告信息
router.post("/findInfo", (req, res) => {
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
          msg: "获取成功！",
          data: result
        });
      } else {
        res.json({
          success: false,
          msg: "公告暂无消息！"
        });
      }
    })
    .catch(err => {
      res.json({
        success: false,
        msg: err
      });
    });
});
module.exports = router;
