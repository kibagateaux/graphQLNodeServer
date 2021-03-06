import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  printSchema
} from 'graphql';

import { introspectionQuery } from 'graphql/utilities';

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
  fields: () => ({
// * mplementation: How to use authentication token *
// * together with viewer *


// On the server-side, create a mutation to obtain
  // an authentication token. Let's name it LoginMutation.
  // Input to this mutation are the user credentials
  // and the output is an authentication token.
// Not a mutation in this case.
// FBLogin useus mutation callback to register OAuth


// On the client-side, implement a client-side mutation.
  // After the mutation is successful,
  // store the authentication token.

// On the client-side, add authToken parameter
  // for your viewer queries.
  // The value of authToken is the authentication token
  // received after successful login mutation.

    influencers: {
      type: new GraphQLList(InfluencerType),
      args: {
        id: { type: GraphQLInt },
        username: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        args.is_influencer = true
        return db.models.user.findAll({ where: args })
          .then(res => res).catch(err => console.log(err));
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
        args.media_type === "video";
        return db.models.video.findAll({ where: args })
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: {
        id: { type: GraphQLInt },
        username: { type: GraphQLString }
      },
      resolve: (parent, args) =>
        db.models.user.findAll({ where: args })

    }
  })
})

export default new GraphQLSchema({
  query: QueryType,
  // mutation: MutationType
})
