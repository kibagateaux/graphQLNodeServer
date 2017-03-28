import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLInterfaceType
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';


import db from '../db';

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
     console.log(type);

    if (type === 'User') {
      return db.models.user.findById(id);
    } else if (type === 'Video') {
      return  db.models.video.findById(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return UserType;
    } else if (obj instanceof Video) {
      return VideoType;
    } else if (obj instanceof Influencer){
      return InfluencerType;
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
      name: { type: GraphQLString },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
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
      name: { type: GraphQLString },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      twitterUsername: { type: GraphQLString },
      instagramUsername: { type: GraphQLString },
      youtubeUsername: { type: GraphQLString },
      videos: {
        type: videoConnection,
        args: connectionArgs,
        resolve: (user, args) => {
           console.log("InfluencerType videos resolve");
          console.log(args);

          let something = user.getVideos(user.id).then(arr =>{
             console.log("=------====video array---===--=-=====");
              console.log(arr);
             return arrconnectionFromArray( arr, args)
           });
            console.log(" sometihng");
             console.log(something);
           return something;

        }
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
        type: influencerConnection,
        description: "Author of the video",
        args: connectionArgs,
        resolve: (video, args) => {
           console.log("VideoType author resolve");
          return (
            video
             .getVideo(video.id)
             .then(video =>
               arrconnectionFromArray(arr, args)
             )
          )
        }
      }
   }
  }
})

export { VideoType, UserType, InfluencerType }
