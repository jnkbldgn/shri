const { models } = require('../../models');

module.exports.queryText = `
  user(id: ID!): User
  users: [User]
`;

module.exports.queries = {

  async user (root, { id }) {
    return await models.User.findById(id);
  },

  async users (root, args, context) {
    return await models.User.findAll({}, context);
  }
}
