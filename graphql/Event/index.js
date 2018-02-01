const { mutations, mutationsText } = require('./mutations');
const { queries, queryText } = require('./queries');
const { schema } = require('./schema');
const { resolvers } = require('./resolvers');

module.exports = {
  name: 'Event',
  mutations,
  mutationsText,
  queries,
  queryText,
  schema,
  resolvers
}
