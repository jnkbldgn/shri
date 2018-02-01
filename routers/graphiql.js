require('dotenv').config();
const { rootSchema } = require('../graphql');
const graphqlHTTP  = require('express-graphql');
const router = require('express').Router();

router.use(graphqlHTTP({
    endpointURL: '/graphql',
    schema: rootSchema,
    graphiql: process.env.APP_ENV ===  'development'
  }));

module.exports.graphiql = router;
