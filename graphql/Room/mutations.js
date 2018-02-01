const { models } = require('../../models');

module.exports.mutationsText = `
  createRoom(input: RoomInput!): Room
  updateRoom(id: ID!, input: RoomInput!): Room
  removeRoom(id: ID!): Room
`;

module.exports.mutations = {

  async createRoom(root, { input }, context){
    return await models.Room.create(input);
  },

  async updateRoom(root, { id, input }, context){
    return await models.Room.findById(id)
                            .then(room => room.update(input));
  },

  async removeRoom (root, { id }, context) {
    return await models.Room.findById(id)
                            .then(room => room.destroy());
  }
};
