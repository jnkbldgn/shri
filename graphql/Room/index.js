const { mutations, mutationsText } = require('./mutations');
const { queries, queryText } = require('./queries');
const { schema } = require('./schema');

module.exports = {
  name: 'Room',
  mutations,
  mutationsText,
  queries,
  queryText,
  schema
};
