import {
  GraphQLObjectType,
  GraphQLSchema,

} from 'graphql';
// var mutations = require('./mutations');
// var queries = require('./queries/SingleUserQuery');

const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    count: {
      type: GraphQLInt,
      resolve: function() {
        return count;
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query
  // mutation: new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: mutations
  // })
});

export default schema;

