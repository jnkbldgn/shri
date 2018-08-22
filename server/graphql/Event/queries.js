const { models } = require('../../models');
const { Op } = require('sequelize');

module.exports.queryText = `
  event(id: ID!): Event
  events: [Event]
  eventsRangDate(dateStart: Date!, dateEnd: Date!): [Event]
`;

module.exports.queries = {

  async event (root, { id }) {
    return await models.Event.findById(id);
  },

  async events (root, args, context) {
    return await models.Event.findAll({}, context);
  },

  async eventsRangDate (root, { dateStart, dateEnd }, context) {
    return await models.Event.findAll({
      where: {
        dateStart:{
          [Op.gte]: new Date(dateStart)
        },
        dateEnd:{
          [Op.lte]: new Date(dateEnd)
        }
      }
    });
  }

};
