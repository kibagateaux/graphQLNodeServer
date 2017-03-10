import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString
} from 'graphql';

// import userModel from './types/users';

// var mutations = require('./mutations');
// var queries = require('./queries/SingleUserQuery');
let count = 0;
const Query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: function() {
        return 'World';
      }
    },
    count:{
      type: GraphQLInt,
      resolve: function(){
        return count;
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: Query
  // mutation: new GraphQLObjectType({
  //   name: 'Mutation',
  //   fields: mutations
  // })
});

var query = '{ count }';

graphql(schema, query).then(result => {

  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);

});
export default schema;
