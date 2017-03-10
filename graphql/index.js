var {
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql');
// var mutations = require('./mutations');
// var queries = require('./queries/SingleUserQuery');

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: "User",
      resolve() {
        return {
          id: '123',
          name: 'freiksenet'
        }
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
  // mutation: new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: mutations
  // })
});

exports.schema = schema;

