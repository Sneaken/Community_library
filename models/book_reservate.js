/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const book_reservate = sequelize.define(
  "book_reservate",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    time_of_appointment: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    ending_time_of_appointment: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    reader_number: {
      type: Sequelize.DataTypes.CHAR(18),
      allowNull: true,
      references: {
        model: "user",
        key: "id_number"
      }
    },
    book_label: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: "book_storage",
        key: "label"
      },
      unique: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "book_reservate"
  }
);
module.exports = book_reservate;
