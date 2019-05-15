/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const libraryInfo = sequelize.define(
  "library_info",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "library_info"
  }
);
module.exports = libraryInfo;
