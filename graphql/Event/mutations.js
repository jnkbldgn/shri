const { models } = require('../../models');

module.exports.mutationsText = `
  createEvent(input: EventInput!, usersIds: [ID], roomId: ID!): Event
  updateEvent(id: ID!, input: EventInput!): Event
  removeUserFromEvent(id: ID!, userId: ID!): Event
  addUserToEvent(id: ID!, userId: ID!): Event
  changeEventRoom(id: ID!, roomId: ID!): Event
  removeEvent(id: ID!): Event
`;

module.exports.mutations = {

  async createEvent (root, { input, usersIds, roomId }, context) {
    return await models.Event.create(input)
                             .then(event => Promise.all([event.setRoom(roomId), event.setUsers(usersIds)])
                                                   .then(([event, eventUsers]) => event));
  },

  async updateEvent (root, { id, input }, context) {
    return await models.Event.findById(id)
                       .then(event => event.update(input).then(event => event));
  },

  async addUserToEvent (root, { id, userId }, context) {
    return await models.Event.findById(id)
                             .then(event => event.addUser(userId).then(user => event));
  },

  async removeUserFromEvent (root, { id, userId }, context) {
    return await models.Event.findById(id)
                             .then(event => event.removeUser(userId).then(user => event));
  },

  async changeEventRoom (root, { id, roomId }, context) {
    return await models.Event.findById(id)
                             .then(event => event.setRoom(roomId).then(room => event));
  },

  async removeEvent (root, { id }, context) {
    return await models.Event.findById(id)
                             .then(event => event.destroy());
  }

};
