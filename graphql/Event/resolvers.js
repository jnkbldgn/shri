const GraphQLDate = require('graphql-date');

module.exports.resolvers = {

  Event: {
    async users(event) {
      return await event.getUsers();
    },
    async room(event) {
      return await event.getRoom();
    }
  },

  Date: {
    name: 'Date',
    type: GraphQLDate,
    description: 'Date scalar type. Input format yyyy-MM-ddThh:mm:ss. Return of client Date.getTime()',
    parseValue(value) {
      return isNaN(Date.parse(value)) ? null : new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    }
  }
};
