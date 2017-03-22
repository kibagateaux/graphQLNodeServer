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
  if (data.instagramUsername) {
    return InfluencerType;
  }
  if(data.username){
    return ViewerType;
  }
};

const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos for user viewing",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    author: {
      type: InfluencerType,
      resolve: (parent, args) => {
       return parent.db.any(
          "SELECT * FROM useres WHERE id = $1", [parent.id]
        ).then(result => result)
      }
    }

  },
  resolve: ({db}, args) => {
    return db.any(
      "SELECT * FROM videos WHERE id = $1", [args.id]
    ).then(result => result)
  }
});

const UserType = new GraphQLInterfaceType({
  name: 'UserType',
  description: "Interface for all users",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
  resolveType: resolveType
});

const InfluencerType = new GraphQLObjectType({
  name: "InfluencerType",
  description: "Influencer's with content",
  interfaces: [ UserType ],
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    age: { type: GraphQLInt },
    interests: { type: new GraphQLList( GraphQLString )},
    twitterUsername: { type: GraphQLString },
    instagramUsername: { type: GraphQLString },
    youtubeUsername: { type: GraphQLString },
    // videos: {
    //   type: new GraphQLList(VideoType),
    //   resolve: (parent, args) => {
    //     return parent.db.any(
    //       "SELECT * FROM VIDEOS WHERE author = $1", [args.id]
    //     ).then(result => result)
    //   }}
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
      influencer: {
        type: InfluencerType,
        args: {
          id: {
            description: "Variable to search user in database",
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: ({db}, {id}) =>{
           console.log("influencer resolve id");
            console.log(id);
          return db.one(
            "SELECT * FROM users where id = $1", [id]
            ).then(result => {
               console.log("resolve result", result);
              return result
            })
        }
      },
      user: {
        type: UserType,
        args: {
          name: {
            description: "user's full name",
            type: GraphQLString
          },
          id: {
            description: "Variable to search user in database",
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (root, args, context) => root.db.any(
          //make name dynamic so can select by username, name, or email
          "SELECT * FROM users WHERE username = $1", [args.id]
        ).then(result => result)
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
