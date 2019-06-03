// Require the framework and instantiate it
import 'isomorphic-fetch';
import CaydeServer, { handle, hot } from '../../cayde-server';
import gql from 'graphql-tag';
import { ApolloServer} from 'apollo-server'
import koaStatic from 'koa-static';
import path from 'path';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const cayde = new CaydeServer();
// all pages are routes by default

cayde.use(koaStatic(path.join(process.cwd(), 'dist')));
cayde.use(async ctx => {
  console.log('hello!!');
  await handle(ctx);

  return;
});

export default hot(module, cayde);
