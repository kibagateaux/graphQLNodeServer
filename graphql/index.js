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
})
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


const {connectionType: influencerConnection} =
  connectionDefinitions({name: 'Influencer', nodeType: InfluencerType});

const {connectionType: videoConnection} =
  connectionDefinitions({name: 'Video', nodeType: VideoType});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Function that creates changes",
  fielads: () => {
    return {
      createNewUser: {
        type: UserType,

      }
    }
  }
})

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "RootQuery",
  fields: () => {
    return {
      node: nodeField,
      influencers: {
        type: new GraphQLList(InfluencerType),
        args: {
          id: {type: GraphQLString},
          username: {type: GraphQLString}
        },
        resolve: (root, args) => {
          return db.models.user.findAll({ where: args })
        }
      },
      videos: {
        type: new GraphQLList(VideoType),
        args: {
          id: { type: GraphQLInt },
          authorId: { type: GraphQLString },
          title: {type: GraphQLString}
        },
        resolve: (root, args) => {
          let id = Number.parseInt(args.id)
           console.log("video query resole");
            console.log(root, args);
          return db.models.video.findAll({ where: args })
        }
      }
    }
  }
})

export default new GraphQLSchema({
  query: QueryType
})
