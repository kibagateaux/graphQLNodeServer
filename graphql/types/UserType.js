
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

import VideoType from './VideoType';

const resolveType = (data) => {
  if(data.instagramUsername) {
    return InfluencerType;
  }
  if(data.username){
    return ViewerType;
  }
};

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
    videos: {
      type: new GraphQLList(VideoType),
      resolve: (parent, args, context) => {
          console.log("InfluencerType Videos resolve parent");
          console.log(parent);
        return db.any(
          "SELECT * FROM VIDEOS WHERE author = $1", [parent.id]
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

export { VideoType, InfluencerType };
