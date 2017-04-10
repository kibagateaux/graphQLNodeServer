import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

//import PageInfoType from relay
// https://github.com/graphql/graphql-relay-js/blob/master/src/connection/connectiontypes.js

import db, { User, Video, Media } from '../db';



const resolveType = (data) => {
  if(data.instagramUsername) {
    return InfluencerType;
  }
  if(data.username){
    return InfluencerType;
  }
};

const {nodeInterface, nodeField} = nodeDefinitions(
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
     console.log("nodeDefinitions");
      console.log(obj);
       console.log(obj.is_influencer);
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
  fields: () => {
    return {
      id: { type: GraphQLInt },
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      facebookId: { type: GraphQLString },
      facebookAccessToken: { type: GraphQLString },
      // these are custom interests pertaining to our product
      // for an exhaustive list use FB or Google user data
      interests: { type: new GraphQLList(GraphQLString) }
    }
  },
  resolveType: resolveType
});


const InfluencerType = new GraphQLObjectType({
  name: "InfluencerType",
  description: "Influencer using our services",
  interfaces: [UserType],
  fields: () => {
    return {
      id: { type: GraphQLInt },
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      profileImage: {
        type: GraphQLString,
        resolve: (influ) => influ.profile_img
      },
      facebookId: { type: GraphQLString },
      facebookAccessToken: { type: GraphQLString },
      twitterUsername: { type: GraphQLString },
      instagramUsername: { type: GraphQLString },
      youtubeUsername: { type: GraphQLString },
      interests: { type: new GraphQLList(GraphQLString) },
      hasAgency: { type: GraphQLString },
      agencyName: { type: GraphQLString },
      bio: { type: GraphQLString },
      followers: {
        type: new GraphQLList(UserType)
        // resolve: (influ) => db.models.user.findAll({where: id: influ.followers })
      },
      videos: {
        type: videoConnection,
        description: "Videos authored by Influencer",
        args: connectionArgs,
        resolve: (user, args) =>
          user.getVideos().then(arr =>
            connectionFromArray( arr, args )
          )
      },
      media: {
        type: mediaConnection,
        description: "Media authored by Influencer",
        args: connectionArgs,
        resolve: (user, args) =>
          user.getMedia()
           .then(arr => connectionFromArray( arr, args ) )
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
      category: { type: new GraphQLList(GraphQLString) },
      author: {
        type: influencerConnection,
        // type: InfluencerType,
        description: "Author of the video",
        args: connectionArgs,
        resolve: (video, args) =>
          db.models.user.findAll({
            where: { id : video.userId }
          })
          .then(arr => connectionFromArray( arr, args ))
      }
   }
  }
});

// MediaTypeEnum  example
// var MediaTypeEnum = new GraphQLEnumType({
//   name: 'RGB',
//   values: {
//     RED: { value: 0 },
//     GREEN: { value: 1 },
//     BLUE: { value: 2 }
//   }
// });

// Should Media be an interface for Videos / Pictures / etc. ?
// |______|______|
// | Pros | Cons |
// | One DB Model |
const MediaType = new GraphQLObjectType({
  name: "MediaType",
  description: "Media created by Influencers",
  interfaces: [nodeInterface],
  fields: () => {
    return {
      id: globalIdField('Media'),
      caption: { type: GraphQLString },
      // type should be new GQL Enum
      mediaType: {
        type: GraphQLString,
        resolve: m => m.media_type
      },
      sourceUrl: {
        type: GraphQLString,
        resolve: m => m.source_url
      },
      category: { type: new GraphQLList(GraphQLString) },
      author: {
        type: influencerConnection,
        description: "Author of the medium",
        args: connectionArgs,
        resolve: (m, args) =>
          db.models.user.findAll({
            where: { id : m.userId }
          })
          .then(arr => connectionFromArray( arr, args ))
      }
   }
  }
});


const {connectionType: influencerConnection} =
  connectionDefinitions({name: 'Influencer', nodeType: InfluencerType});

const {connectionType: videoConnection} =
  connectionDefinitions({name: 'Video', nodeType: VideoType});

const {connectionType: mediaConnection} =
  connectionDefinitions({name: 'Media', nodeType: MediaType});


export { VideoType, MediaType, UserType, InfluencerType, nodeField }
