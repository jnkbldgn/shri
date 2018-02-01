const { mutations, mutationsText } = require('./mutations');
const { queries, queryText } = require('./queries');
const { schema } = require('./schema');

module.exports = {
  name: 'User',
  mutations,
  mutationsText,
  queries,
  queryText,
  schema
}
