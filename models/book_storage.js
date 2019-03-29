/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const bookStorage = sequelize.define(
  "book_storage",
  {
    ssh: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: "book_info",
        key: "ssh"
      }
    },
    label: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    collection_place: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: Sequelize.DataTypes.ENUM("库本", "在库", "借出", "已预约"),
      allowNull: true,
      defaultValue: "在库"
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "book_storage"
  }
);
module.exports = bookStorage;
