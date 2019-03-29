/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const topCategory = sequelize.define(
  "top_category",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    classify_id: {
      type: Sequelize.DataTypes.CHAR(1),
      allowNull: false,
      primaryKey: true
    },
    classify_name: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "top_category"
  }
);
module.exports = topCategory;
