/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const subclassification = sequelize.define(
  "subclassification",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    top_id: {
      type: Sequelize.DataTypes.CHAR(1),
      allowNull: false,
      primaryKey: true,
      references: {
        model: "top_category",
        key: "classify_id"
      }
    },
    sub_id: {
      type: Sequelize.DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    sub_name: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "subclassification"
  }
);
module.exports = subclassification;
