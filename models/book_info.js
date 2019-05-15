/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const bookInfo = sequelize.define(
  "book_info",
  {
    ssh: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    ztm: {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: false
    },
    zrz: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    isbn: {
      type: Sequelize.DataTypes.STRING(30),
      allowNull: false
    },
    price: {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: false
    },
    cbs: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    datestr: {
      type: Sequelize.DataTypes.STRING(4),
      allowNull: false
    },
    content: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: Sequelize.DataTypes.INTEGER(11),
      allowNull: true
    },
    pages: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true
    },
      img_place: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
      },
    reserve: {
      type: Sequelize.DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: "5"
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "book_info"
  }
);
module.exports = bookInfo;
