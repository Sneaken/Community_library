/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const bookBorrow = sequelize.define(
  "book_borrow",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    reader_number: {
      type: Sequelize.DataTypes.CHAR(32),
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
        key: "book_label"
      }
    },
    borrow_time: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false
    },
    should_still_return_time: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false
    },
    renewal_time: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    number_of_renewals: {
      type: Sequelize.DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0"
    },
    status: {
      type: Sequelize.DataTypes.ENUM("正常", "逾期"),
      allowNull: false,
      defaultValue: "正常"
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "book_borrow"
  }
);
module.exports = bookBorrow;
