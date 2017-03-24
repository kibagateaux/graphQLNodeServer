import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLInterfaceType
} from 'graphql';

import db from '../db';

const resolveType = (data) => {

  if(data.instagramUsername) {
    return InfluencerType;
  }
  if(data.username){
    return InfluencerType;
  }
};

const UserType = new GraphQLInterfaceType({
  name: "UserTypeInterface",
  description: "Interface for all users",
  fields: () => {
    return {
      id: { type: GraphQLString },
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
  fields: () => {
    return {
      id: { type: GraphQLString},
      name: { type: GraphQLString },
      username: { type: GraphQLString },
      email: { type: GraphQLString },
      twitterUsername: { type: GraphQLString },
      instagramUsername: { type: GraphQLString },
      youtubeUsername: { type: GraphQLString },
      videos: {
        type: new GraphQLList(VideoType),
        resolve: (user, args) => {
          return user.getVideos();
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
      title: { type: GraphQLString }
   }
  }
})

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
          id: {type: GraphQLString},
          title: {type: GraphQLString}
        },
        resolve: (root, args) => {
          return db.models.video.findAll({ where: args })
        }
      }
    }
  }
})

export default new GraphQLSchema({
  query: QueryType
})
