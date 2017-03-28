import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import db, { User } from '../db';

import { InfluencerType, UserType, VideoType } from './ModelTypes';


const CreateNewUserMutation = mutationWithClientMutationId({
  name: 'CreateNewUserMutation',
  inputFields: {
    username: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    user: {
      type: InfluencerType,
      resolve: user => user,
    },
    name: {
      type: GraphQLString,
      resolve: ({name}) => name
    },
    username: {
      type: GraphQLString,
      resolve: ({username}) => username
    },
    email: {
      type: GraphQLString,
      resolve: ({email}) => email
    },
    twitterUsername: {
      type: GraphQLString,
      resolve: ({twitterUsername}) => twitterUsername
    },
    youtubeUsername: {
      type: GraphQLString,
      resolve: ({youtubeUsername}) => youtubeUsername
    },
    instagramUsername: {
      type: GraphQLString,
      resolve: ({instagramUsername}) => instagramUsername
    },
    age: {
      type: GraphQLInt,
      resolve: ({age}) => age
    },
    interests: {
      type: new GraphQLList(GraphQLString),
      resolve: ({interests}) => interests
    },
  },
  mutateAndGetPayload: (data) => {
    // how to give it an Influencer or User type?
    // in db there is no differentiaton
    // in GraphQL based on db column "is_influencer"
    const { name, username, email, interests } = data
    const user  = User.create({
      name, username, email
    })._boundTo.dataValues

    return user ;
  },
});

export { CreateNewUserMutation };
