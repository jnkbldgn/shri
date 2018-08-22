const Sequelize = require('sequelize');

const Op = Sequelize.Op;
const sequelize = new Sequelize('shri-db', 'demo', 'root',{
  dialect: 'sqlite',
  storage: './db.sqlite3',
  operatorsAliases: { $and: Op.and },
  logging: console.log
});

module.exports.sequelize = sequelize;
