const { models } = require('../../models');

module.exports.mutationsText = `
  createUser(input: UserInput!): User
  updateUser(id: ID!, input: UserInput!): User
  removeUser(id: ID!): User
`;

module.exports.mutations = {

  async createUser (root, { input }, context) {
    return await models.User.create(input);
  },

  async updateUser (root, { id, input }, context) {
    return await models.User.findById(id)
                            .then(user => user.update(input));
  },

  async removeUser (root, { id }, context) {
    return await models.User.findById(id)
                            .then(user => user.destroy());
  }
};
