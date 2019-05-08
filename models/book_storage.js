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
    book_label: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    collection_place: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: Sequelize.DataTypes.ENUM("库本", "在库", "借出"),
      allowNull: false,
      defaultValue: "在库"
    },
    appointment_of_reader_number: {
      type: Sequelize.DataTypes.CHAR(18),
      allowNull: true,
      references: {
        model: "user",
        key: "id_number"
      }
    },
    reservation: {
      type: Sequelize.DataTypes.INTEGER(1),
      allowNull: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "book_storage"
  }
);
module.exports = bookStorage;
