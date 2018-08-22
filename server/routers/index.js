const express = require ('express');
const router = express.Router();
const { main } = require('./main');
const { graphiql } = require('./graphiql');

router.get('/', main);
router.use('/graphql', graphiql);

module.exports.router = router;
