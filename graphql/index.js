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
         // where User is a db schema
         // MongoDB example
          //var UserSchema = new mongoose.Schema({
              //   name: {
              //     type: String
              //   },
              //   friends: [{
              //     type: mongoose.Schema.Types.ObjectId,
              //     ref: 'User'
              //   }]
              // });
         // return User.findById(id, projections);
         // var User = mongoose.model('User', UserSchema);
          return args
        }
      },

      // Vanilla login querys
      emailLogin: {
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
        resolve: ({emailLogin}, arg2, context) => {
           console.log("YOU HAVE HIT THE LOGIN ROUGHT");
           console.log("context is what?");
            console.log(context);
           console.log("should be params");
            console.log(arg2);
          return emailLogin
        }
      },

      //OAuth login registered to database
      facebookLogin: {
        type: GraphQLBoolean,
        args: {
          facebook_id: {
            type: new GraphQLNonNull(GraphQLString),
            // description: "facebookID returned by facebook OAuth"
          },
          facebook_token: {
            type: new GraphQLNonNull(GraphQLString),
           // description: "facebookToken returned by facebook OAuth"
          }
        },
        resolve: (parent, {facebook_id, facebook_token}, context) => {
          if(facebook_id && facebook_token){
            return true
          }
          return false
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
