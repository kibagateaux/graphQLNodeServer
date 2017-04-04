import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLNonNull
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

//import PageInfoType from relay
// https://github.com/graphql/graphql-relay-js/blob/master/src/connection/connectiontypes.js

import db, { User, Video } from '../db';



const resolveType = (data) => {
  if(data.instagramUsername) {
    return InfluencerType;
  }
  if(data.username){
    return InfluencerType;
  }
};

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    console.log(type);
    if (type === 'User') {
      return db.models.user.findById(id)
    } else if (type === 'Video') {
       return db.models.video.findById(id)
    }
    else if (type === 'Influencer') {
      return db.models.user.findById(id)
    }else {
      return null;
    }
  },
  (obj) => {
    switch(Object.getPrototypeOf(obj).Model){
      case User:
        if(obj.is_influencer) return InfluencerType
        return UserType;
      case Video:
        return VideoType;
      default:
        return null;
    }
  }
);


const UserType = new GraphQLInterfaceType({
  name: "UserTypeInterface",
  description: "Interface for all users",
  interfaces: [nodeInterface],
  fields: () => {
    return {
      id: globalIdField('User'),
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      facebook_id: { type: GraphQLString },
      facebook_access_token: { type: GraphQLString },
      // these are custom interests pertaining to our product
      // for additional use FB or Google user data
      interests: { type: new GraphQLList(GraphQLString) }
    }
  },
  resolveType: resolveType
});


const InfluencerType = new GraphQLObjectType({
  name: "InfluencerType",
  description: "Influencer using our services",
  interfaces: [UserType, nodeInterface],
  fields: () => {
    return {
      id: globalIdField('Influencer'),
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      facebook_id: { type: GraphQLString },
      facebook_access_token: { type: GraphQLString },
      twitterUsername: { type: GraphQLString },
      instagramUsername: { type: GraphQLString },
      youtubeUsername: { type: GraphQLString },
      interests: { type: new GraphQLList(GraphQLString) },
      videos: {
        type: videoConnection,
        args: connectionArgs,
        resolve: (user, args) =>
          user.getVideos().then(arr =>
            connectionFromArray( arr, args )
          )
      }
    }
  }
});

const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos created by Influencers",
  interfaces: [nodeInterface],
  fields: () => {
    return {
      id: globalIdField('Video'),
      title: { type: GraphQLString },
      author: {
        type: InfluencerType,
        description: "Author of the video",
        args: connectionArgs,
        resolve: (video, args) =>
          db.models.user.findById(video.userId).then(res => res)
      }
   }
  }
})


const {connectionType: influencerConnection} =
  connectionDefinitions({name: 'Influencer', nodeType: InfluencerType});

const {connectionType: videoConnection} =
  connectionDefinitions({name: 'Video', nodeType: VideoType});

export { VideoType, UserType, InfluencerType, nodeField }
