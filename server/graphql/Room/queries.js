const { models } = require('../../models');

module.exports.queryText = `
  room(id: ID!): Room
  rooms: [Room]
`;

module.exports.queries = {

  async room (root, { id }) {
    return await models.Room.findById(id);
  },

  async rooms (root, args, context) {
    return await models.Room.findAll({}, context);
  }

};
