require('dotenv').config();

const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
  dialect: process.env.DB_DIALECT,
  storage: process.env.DB_STORAGE,
  operatorsAliases: { $and: Op.and },
  logging: console.log
});

module.exports.sequelize = sequelize;
