const Sequelize = require('sequelize');
// 引入数据库配置文件
const sqlConfig = require('./conf').mysql;

const sequelize = new Sequelize (sqlConfig.database, sqlConfig.user, sqlConfig.password, {
    host: sqlConfig.host,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;
