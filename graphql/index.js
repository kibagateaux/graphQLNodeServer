import {
  buildSchema,
} from 'graphql';

import {
  graphql,
  GraphQLSchema,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
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

const UserType = new GraphQLInterfaceType({
  name: 'UserType',
  description: "Interface for all users",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
  },
  // resolveType: resolveType
});

const InfluencerType = new GraphQLObjectType({
  name: "InfluencerType",
  description: "Influencer's with content",
  interfaces: [ UserType ],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
    twitterUsername: { type: GraphQLString },
    instagramUsername: { type: GraphQLString },
    youtubeUsername: { type: GraphQLString },
  },
  resolve: (root, args) => {
    return;
  }
})

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
        resolve: ({emailLogin}, arg2, context) => emailLogin
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
