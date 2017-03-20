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
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';


const resolveType = (data) => {
  if (data.username) {
    return UserType;
  }
};

const UserType = new GraphQLInterfaceType({
  name: 'UserType',
  description: "Interface for all users",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
  },
  resolveType: resolveType
});

const InfluencerType = new GraphQLObjectType({
  name: "InfluencerType",
  description: "Influencer's with content",
  interfaces: [ UserType ],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLInt },
    interests: { type: new GraphQLList( GraphQLString )},
    twitterUsername: { type: GraphQLString },
    instagramUsername: { type: GraphQLString },
    youtubeUsername: { type: GraphQLString },
  }
});

const ViewerType = new GraphQLObjectType({
  name: "ViewerType",
  description: "Current user viewing application on client",
  interfaces: [ UserType ],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    name: { type: new GraphQLNonNull(GraphQLString) },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (root, args) => {
        console.log("ViewerType username resolve function");
        console.log(args);
        return root.db.one(
          "SELECT * FROM users WHERE username = $1", [args.username]
        ).then(result => result);
      }
    },
    age: { type: GraphQLInt }
  }
})

const queryType = new GraphQLObjectType({
    name: 'RootQueryType',
    type: [ UserType ],
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      },
      viewer: {
        type: ViewerType,
        resolve: (root, args) => {
          return root.db.one(
            "SELECT * FROM users WHERE id = $id",
            {$id: args.id}
          ).then(result => result)
        }
      },
      user: {
        type: UserType,
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
          return args
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
