const express = require ("express");
const router = express.Router ();

const Sequelize = require ('sequelize');
const Op = Sequelize.Op;

const BookInfo = require ("../../models/book_info");
//图书查询
router.get ("/find", (req, res) => {
    const book = req.query;
    BookInfo.findAll ({
        where: {
            ztm: {
                [Op.like]: '%' + book.input + '%'
            }
        }
    }).then(result=>{
        if (result.length){
            res.json({
                success:true,
                totalNum:result.length,
                data:result
            });
        }else{
            res.json({
                success:false,
                msg:'暂无图书'
            });
        }

    });
});
module.exports = router;

