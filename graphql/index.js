import {
  buildSchema,
} from 'graphql';

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';


const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A user of the app',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the user.',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the user.',
    }
  }),

});
// const auth =
//loginType implments authType
//should maybe only need args for a query not a whole Type See below
// const loginType = new GraphQLObjectType({
//   name: "loginType",
//   description: "Receives login credentials and returns boolean value for login",
//   fields: () => {
//     email: {
//       type: GraphQLString,
//       // description: "Email submission for login"
//     },
//     username: {
//       type: GraphQLString
//     },
//     password: {
//       type: new GraphQLNonNull(GraphQLString),
//       // description: "Password submission for login"
//     }
//   }
// });

const regsiterType = new GraphQLObjectType({
  name: "registerNewUser"

});

const queryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      },
      user: {
        type: userType,
        args: {
          name: {
            description: "Name of the user",
            type: new GraphQLNonNull(GraphQLString)
          },
          id: {
            description: "Unique user id",
            type: GraphQLString
          }
        },
        resolve: (req, args, context) => {
          console.log("User req context");
           console.log(context);
          return args
        }
      },
      login: {
        type: GraphQLBoolean,
        args: {
          email: {
            type: GraphQLString,
            // description: "Email submission for login"
          },
          username: {
            type: GraphQLString,
            // description: "Username submission for login"
          },
          password: {
            type: new GraphQLNonNull(GraphQLString),
            // description: "Password submission for login"
          },
        },
        resolve: (arg1, arg2, context) => {
           console.log("YOU HACE HIT THE LOGIN ROUGHT");
           console.log("cont3ext is what?");
            console.log(context.db);
           console.log("arg1 is what?");
            console.log(arg1);
           console.log("should be params");
            console.log(arg2);
          return "YOU HAVE HIT THE LOGIN ROUGHT"
        }
      }
    }

  })



var schema = new GraphQLSchema({
  query: queryType
});


// const apiSchema = buildSchema(`

//   type User{
//     name: String!
//     age: Int
//     id: ID!
//   }

//   type Query{
//     hello: String
//     user(name: String!, id: Int): User
//     login(email: String!, password: String!): String
//   }

//   `)

export default schema;
