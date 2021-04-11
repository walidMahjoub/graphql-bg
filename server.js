const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const userSchema = require('./schemas/schema');

const server = express();

server.use(
  '/hello-graphql',
  graphqlHTTP({
    graphiql: true,
    schema: userSchema,
  })
);

server.listen('4000', () => {
  console.log('Listening on port 4000 !');
});
