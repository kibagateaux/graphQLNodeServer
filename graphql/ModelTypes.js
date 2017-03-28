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


const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);

   console.log("nodeDefinitions type");
   switch(type){
    case "Influencer":
      const influ =  db.models.user.findById(id);
      console.log(influ);
     return influ;
    case "User":
      return db.models.user.findById(id);
    case "Video":
      return  db.models.video.findById(id);
    default:
      return null;
   }
  },
  (obj) => {
    //TODO Figure out why instanceof does not work
    // does it have to do with original QL definitions?
    // User is never defined but from docs
    // UserType also throws an "unresolveable" error
    if (obj instanceof User) {
      return UserType;
    } else if (obj instanceof Video) {
      return VideoType;
    } else {
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
      username: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
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
      username: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      twitterUsername: { type: GraphQLString },
      instagramUsername: { type: GraphQLString },
      youtubeUsername: { type: GraphQLString },
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
  fields: () => {
    return {
      id: globalIdField('Video'),
      title: { type: GraphQLString },
      author: {
        type: InfluencerType,
        description: "Author of the video",
        args: connectionArgs,
        resolve: (video, args) => {

           // console.log("VideoType author resolve");
           // const user = video.getUser()
           // const connections = user.then(arr => {
           //   console.log("array to connectionFromArray");
           //    console.log([arr.dataValues.id]);
            let author = db.models.user.findById(video.userId).then(res => res);
            console.log("arr from db findById");
             console.log(author);
            console.log(author.username);
            return author
           }

      }
   }
  }
})

const {connectionType: influencerConnection} =
  connectionDefinitions({name: 'Influencer', nodeType: InfluencerType});

const {connectionType: videoConnection} =
  connectionDefinitions({name: 'Video', nodeType: VideoType});

export { VideoType, UserType, InfluencerType, nodeField }
