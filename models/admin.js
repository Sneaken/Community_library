/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const admin = sequelize.define(
  "admin",
  {
    id_number: {
      type: Sequelize.DataTypes.CHAR(18),
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    password: {
      type: Sequelize.DataTypes.CHAR(60),
      allowNull: false
    },
    phone: {
      type: Sequelize.DataTypes.CHAR(11),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "admin"
  }
);
module.exports = admin;
