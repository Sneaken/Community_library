/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");

const bookCompensation = sequelize.define(
  "book_compensation",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    reader_number: {
      type: Sequelize.DataTypes.CHAR(18),
      allowNull: false,
      references: {
        model: "user",
        key: "id_number"
      }
    },
    book_label: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "book_storage",
        key: "label"
      }
    },
    status: {
      type: Sequelize.DataTypes.ENUM("已缴费", "未缴费"),
      allowNull: false
    },
    money: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: false
    },
    time: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "book_compensation"
  }
);

module.exports = bookCompensation;
