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
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: function() {
        return "world"
      }
    },
    count:{
      type: GraphQLInt,
      resolve: function(){
        return count;
      }
    },
    user: {
      type: GraphQLString,
      resolve: function({db,id}){
         console.log("What is Queries first arg??");
          console.log(id);
        return db.one('SELECT * FROM users WHERE id = $1;', [id])
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


export default schema;
