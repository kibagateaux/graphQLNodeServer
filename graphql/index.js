import {
  graphql,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import User from './types/users';

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
      type: User,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(arg1, arg2){
         // console.log("resolve arg1 arg");
         //  console.log(parent);
         console.log("resolve arg2 arg");
          console.log(arg1);
         console.log("resolve thrd arg");
          console.log(arg2);
        let name;
        let username = arg1.db.one('SELECT name FROM users WHERE id = $1;', [arg2.id])
          .then(result => {
            console.log(result)
            return result
          });
           console.log(username);
        return username;

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
