/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const user = sequelize.define(
  "user",
  {
    id_number: {
      type: Sequelize.DataTypes.CHAR(18),
      allowNull: false,
      primaryKey: true
    },
    phone: {
      type: Sequelize.DataTypes.CHAR(11),
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.DataTypes.STRING(12),
      allowNull: false
    },
    password: {
      type: Sequelize.DataTypes.CHAR(32),
      allowNull: false
    },
    deposit: {
      type: Sequelize.DataTypes.FLOAT(5, 2),
      allowNull: false
    },
    email: {
      type: Sequelize.DataTypes.STRING(30),
      allowNull: true
    },
    status: {
      type: Sequelize.DataTypes.ENUM("正常", "挂失", "交罚金"),
      allowNull: false,
      defaultValue: "正常"
    },
    book_number: {
      type: Sequelize.DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "5"
    },
    create_time: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "user"
  }
);
module.exports = user;
