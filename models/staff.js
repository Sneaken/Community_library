/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const staff = sequelize.define(
  "staff",
  {
    id_number: {
      type: Sequelize.DataTypes.CHAR(18),
      allowNull: false,
      primaryKey: true
    },
    staff_phone: {
      type: Sequelize.DataTypes.CHAR(11),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.DataTypes.CHAR(32),
      allowNull: false
    },
    name: {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: false
    },
    identity: {
      type: Sequelize.DataTypes.ENUM("图书管理", "前台服务"),
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "staff"
  }
);
module.exports = staff;
