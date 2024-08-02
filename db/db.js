require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: '192.168.1.30',
  port: 3066,
  dialect: 'mysql',
  logging: false,
});


module.exports = sequelize;