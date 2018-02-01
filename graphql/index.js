const { makeExecutableSchema } = require('graphql-tools');
const { loadModules } = require('../utils/loadModules');
const User = require('./User');
const Room = require('./Room');
const Event = require('./Event');

module.exports.rootSchema = makeExecutableSchema(
  loadModules([User, Room, Event])
);
