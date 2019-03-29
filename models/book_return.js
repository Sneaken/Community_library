/* jshint indent: 2 */
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnect");
const bookReturn = sequelize.define(
  "book_return",
  {
      id: {
          type: Sequelize.DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      reader_number: {
          type: Sequelize.DataTypes.CHAR(18),
          allowNull: false,
          references: {
              model: 'user',
              key: 'id_number'
          }
      },
      book_label: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: false,
          references: {
              model: 'book_storage',
              key: 'label'
          }
      },
      borrow_time: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false
      },
      return_time: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false
      },
      status: {
          type: Sequelize.DataTypes.ENUM('逾期','正常'),
          allowNull: false
      },
      day: {
          type: Sequelize.DataTypes.INTEGER(3),
          allowNull: false,
          defaultValue: '0'
      }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "book_return"
  }
);
module.exports = bookReturn;
