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

import { db } from '../server';

const resolveType = (data) => {
  if(data.instagramUsername) {
    return InfluencerType;
  }
  if(data.username){
    return ViewerType;
  }
};

// TODOS
// Normalize parent/root/{db} as first resolve argument

const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos for user viewing",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    author: {
      //needs to be type Influencer but impossible if defined in same file
      type: new GraphQLList(GraphQLInt),
      resolve: (parent, args) => {
       return db.any(
          "SELECT * FROM users WHERE id = $1", [parent.author]
        ).then(result => {
          return result.map(x => x.id)
        })
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
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (influ) => {
         console.log("InfluencerType id resolve");
         console.log(influ);
         return influ.id
      }},
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    age: { type: GraphQLInt },
    interests: { type: new GraphQLList( GraphQLString )},
    twitterUsername: { type: GraphQLString },
    instagramUsername: { type: GraphQLString },
    youtubeUsername: { type: GraphQLString },
    videos: {
      type: new GraphQLList(VideoType),
      resolve: (influ) => {
          console.log("InfluencerType Videos resolve parent");
          console.log(influ);
        return db.any(
          "SELECT * FROM VIDEOS WHERE author = $1", [influ.id]
        ).then(result => {
          console.log("InfluencerType Videos result");
           console.log(result);
          return result
        })
      }}
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
        resolve: (parent, args, context) =>{
          return db.one(
            "SELECT * FROM users where id = $1", [args.id]
            ).then(result => {
               console.log("Influencer Query resolve result", result);
              return result
            })
        }
      },
      videos: {
        type: VideoType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: "ID of the video's author"
          }
        },
        resolve: (parent, args) => {
           console.log("Video Query resolve parent");
            console.log(parent);
          return parent.db.any(
            "SELECT * FROM users WHERE id = $1", [args.author]
          ).then(result => result)
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
