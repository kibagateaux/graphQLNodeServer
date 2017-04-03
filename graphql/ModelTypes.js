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


// const {nodeInterface, nodeField} = nodeDefinitions(
//   (globalId) => {
//     const {type, id} = fromGlobalId(globalId);

//    console.log("nodeDefinitions type");
//    switch(type){
//     case "Influencer":
//       let influ =  db.models.user.findById(id);
//        console.log("Influencer Type");
//       console.log(influ);
//      return influ;
//     case "Plebian":
//       let pleb =  db.models.user.findById(id);
//        console.log("Plebian Type");
//       console.log(pleb);
//       return pleb
//     case "Video":
//       let video =  db.models.video.findById(id);
//        console.log(" Video Type");
//       console.log(video);
//       return  video
//     default:
//       return null;
//    }
//   },
//   (obj) => {
//       console.log("instance of ");
//     //TODO Figure out why instanceof does not work
//     // does it have to do with original QL definitions?
//     // User is never defined but from docs
//     // UserType also throws an "unresolveable" error
//     if (obj instanceof User) {
//        console.log("instance of Influencer");
//         console.log(obj.dataValues);
//       return InfluencerType;
//     } else if (obj instanceof VideoType) {
//       console.log("instance of Video");
//       return VideoType;
//     } else if (obj instanceof UserType) {
//       console.log("instance of User");
//       return UserType;
//     } else if (obj instanceof PlebianType){
//       console.log("instance of Plebian");
//       return PlebianType;
//     }
//     console.log("no instance de nada");
//     return null;
//   }
// );

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

    console.log(obj);               // Sequelize object
    console.log(User);              // user
    console.log(User.constructor);  // valid constructor

    // This is where the error occurs
    if (obj instanceof User) {
      return UserType;
   } else if (obj instanceof Video)  {
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
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      facebook_id: { type: GraphQLString },
      facebook_access_token: { type: GraphQLString }
    }
  },
  resolveType: resolveType
});

const PlebianType = new GraphQLObjectType({
  name: "PlebianType",
  description: "Everday user, not an influencer ... or anyone important for that matter",
  interfaces: [ UserType, nodeInterface],
  fields: () => (
    {
     id: globalIdField('Plebian'),
     username: { type: GraphQLString },
     name: { type: GraphQLString },
     email: { type: GraphQLString },
     facebook_id: { type: GraphQLString },
     facebook_access_token: { type: GraphQLString }
    }
  )

})


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

// login type shit

// mutation {
//   createReindexAuthenticationProvider(input: {
//     type: google,
//     clientId: "YOUR-GOOGLE-CLIENT-ID",
//     clientSecret: "YOUR-GOOGLE-CLIENT-SECRET",
//     isEnabled: true
//   }) {
//     changedReindexAuthenticationProvider {
//       clientId,
//       id,
//       clientSecret,
//       type,
//       isEnabled
//     }
//   }
// }


const {connectionType: influencerConnection} =
  connectionDefinitions({name: 'Influencer', nodeType: InfluencerType});

const {connectionType: videoConnection} =
  connectionDefinitions({name: 'Video', nodeType: VideoType});

export { VideoType, UserType, InfluencerType, nodeField }
