const { sequelize } = require('../config/db');
const { createModels } = require('../utils/createModels');

createModels(sequelize);
sequelize.sync();

module.exports.models = sequelize.models;
