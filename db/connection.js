const Sequelize = require('sequelize');
const db = new Sequelize('main', 'null', 'null', {
  dialect: 'sqlite',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: '/Users/Daniel_Pease/Desktop/FreshPotatoes-master/db/database.db',
});

module.exports = db;
