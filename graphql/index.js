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
  GraphQLNonNull as NonNull,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

// import {
//   InfluencerType,
//   VideoType,
//   UserType,
//   ViewerType
// } from './types';

import db from '../db';

const resolveType = (data) => {
  let blah = data[0].dataValues;
   console.log("resolveType");
   console.log(blah)
  if(blah.instagramUsername) {
    return InfluencerType;
  }
  if(blah.username){
    return InfluencerType;
  }
};

const digReturnData = (graphqlObj) => {
   console.log("digReturnData graphqlObj");
    console.log(graphqlObj.dataValues);
  return graphqlObj.dataValues
}
// TODOS
// Normalize parent/root/{db} as first resolve argument

const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos for user viewing",
  fields: {
    id: { type: new NonNull(GraphQLString)},
    author: {
      //needs to be type Influencer but impossible if defined in same file
      type: new GraphQLList(GraphQLInt),
      resolve: (video) => video.getInfluencer()
    },
    title: {
      type: GraphQLString
    }
  }
});

const UserType = new GraphQLInterfaceType({
  name: 'UserType',
  description: "Interface for all users",
  fields: {
    id: { type: new NonNull(GraphQLInt)},
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
  fields: () => {
    return {
      id: {
        type: new NonNull(GraphQLInt)
      },
      name: {
        type: GraphQLString
      },
      age: {
        type: GraphQLInt
      },
      username: {
        type: GraphQLString
      },
      twitterUsername: {
        type: GraphQLString
      },
      instagramUsername: {
        type: GraphQLString
      },
      youtubeUsername: {
        type: GraphQLString
      },
      videos: {
        type: new GraphQLList(VideoType),
        resolve: (influ) => influ.getVideos()
      }
    };
  }
});



const ViewerType = new GraphQLObjectType({
  name: "ViewerType",
  description: "Current user viewing application on client",
  interfaces: [ UserType ],
  fields: {
    id: { type: new NonNull(GraphQLInt)},
    name: { type: new NonNull(GraphQLString) },
    username: { type: new NonNull(GraphQLString) },
    age: { type: GraphQLInt }
  }
})

const Query = new GraphQLObjectType({
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
      influencers: {
        type: new GraphQLList(InfluencerType),
        args: {
          id: {
            description: "Variable to search user in database",
            type: new NonNull(GraphQLInt)
          }
        // }
        },
        resolve: (parent, args, context) =>{
           console.log("Influencer resolve args");
            console.log(args);
          return db.models.user.findAll({ where: args })
        }
      },
      videos: {
        type: new GraphQLList(VideoType),
        args: {
          id: {
            type: new NonNull(GraphQLString),
            description: "ID of the video's author"
          }
        },
        resolve: (parent, args) => {
           console.log("Video Query resolve parent");
            console.log(parent);
          return db.models.video.findAll({ where: args })
        }
      },
      users: {
        type: new GraphQLList(UserType),
        args: {
          name: {
            description: "user's full name",
            type: GraphQLString
          },
          id: {
            description: "Variable to search user in database",
            type: new NonNull(GraphQLInt)
          }
        },
        resolve: (root, args) => {
          let users = db.models.user.findAll({ where: args});
           console.log("users query resolve");
            console.log(users);
            return users;
        }
    }
  }
})

const CreateNewUserWithMutation = new GraphQLObjectType({
  name: "CreateNewUserWithMutation",
    fields: {
      errors: { type: new NonNull(new GraphQLList(GraphQLString)) },
      user: { type: UserType },
    },
    args: {
      email: { type: new NonNull(GraphQLString) },
      password: { type: new NonNull(GraphQLString) },
    }

});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Function to create stuff",
  fields: {
    createNewUser: {
      type: UserType,
      args: {
        name: { type: new NonNull(GraphQLString) },
        username: { type: new NonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        console.log("createNewUser Mutation")
        console.log(args);
        let { name, username } = args
        return db.models.user.create({
          name, username, isInfluencer: false
        })
      }
    }
  }
})


var schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
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
