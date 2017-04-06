import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';

import {
  CreateNewUserMutation,
  applyForInfluencerMutation,
  applicantHasBeenAcceptedMutation,
  updateUserDataMutation
} from './Mutations';

import {
  InfluencerType,
  UserType,
  VideoType,
  MediumType,
  nodeField,
} from './ModelTypes';

import db from '../db';

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "RootMutation function that creates changes",
  fields: () => {
    return {
      createNewUser: CreateNewUserMutation,
      applyForInfluencer: applyForInfluencerMutation,
      applicantHasBeenAccepted: applicantHasBeenAcceptedMutation,
      updateUserData: updateUserDataMutation,

    }
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "RootQuery function that returns data",
  fields: () => {
    return {
      node: nodeField,
      schema: printSchema,
      influencers: {
        type: new GraphQLList(InfluencerType),
        args: {
          id: { type: GraphQLInt },
          username: { type: GraphQLString }
        },
        resolve: (parent, args, x, y) => {
          console.log("influencers query resolve");
          // Logic to filter for influencers
          args.is_influencer = true
          var influencer = db
            .models.user
            .findAll({ where: args })
            .then(res => res).catch(err => err);
          console.log(influencer);
          return influencer
        }
      },
      videos: {
        type: new GraphQLList(VideoType),
        args: {
          id: { type: GraphQLInt },
          userId: { type: GraphQLString },
          title: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          // id = Number.parseInt(id);
          return db.models.video.findAll({ where: args })
        }
      },
      users: {
        type: new GraphQLList(UserType),
        args: {
          id: { type: GraphQLInt },
          username: { type: GraphQLString }
        },
        resolve: (parent, args) => {
          return db.models.user.findAll({ where: args })
        }
      }
    }
  }
})

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})
