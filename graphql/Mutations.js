import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
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
    // Q: how to give it an Influencer or User type?
    // in db there is no differentiaton
    // A: in GraphQL based on db column "is_influencer"
    const { name, username, email, interests } = data
    const user  = User.create({
      name, username, email
    })._boundTo.dataValues

    return user ;
  },
});

// mutation hasApplied - adds s.media usernames, has_applied = true
const applyForInfluencerMutation = new mutationWithClientMutationId({
  name: "applyForInfluencerMutation",
  description: "Changes viewer's status to 'Has Applied' and accepts s.media usernames",
  inputFields: {
    twitterUsername: {
      type: GraphQLString,
    },
    youtubeUsername: {
      type: GraphQLString,
    },
    instagramUsername: {
      type: GraphQLString,
    }
  },
  outputFields: {
    user: {type: UserType, resolve: (user) => user },
    hasApplied: {
      type: GraphQLBoolean,
      resolve: ({has_applied}) => has_applied
    }
  },
  mutateAndGetPayload: (data) => {
    data.has_applied = true;
    const user = User.findById(id)
      .then(user => user.set(data))
    const updatedUser = user.save().then(user => user);

    return updatedUser;
  }

});

const applicantHasBeenAcceptedMutation = new mutationWithClientMutationId({
  name: "applicantHasBeenAcceptedMutation",
  description: "Applicant has been accpeted and is formally an 'influencer' ",
  inputFields: {
    isInfluencer: { type: GraphQLBoolean }
  },
  outputFields: {
    user: { type: UserType, resolve: user => user },
    isInfluencer: { type: GraphQLBoolean, resolve: user => user.is_influencer }
  },
  mutateAndGetPayload: (data) => {
    console.log("applicantHasBeenAcceptedMutation data");
    console.log(data);
    let { id } = data;
    // Must use .save, #1 error when debugging
    const influencer = User.findById(id)
      .then(user =>  user.set({is_influencer: true}) );
    return influencer;
  }
})

const updateUserDataMutation = new mutationWithClientMutationId({
  name: "updateUserDataMutation",
  description: "Updates user data in database for given fields",
  inputFields:{
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    twitterUsername: { type: GraphQLString },
    youtubeUsername: { type: GraphQLString },
    instagramUsername: { type: GraphQLString },
    interests: { type: new GraphQLList(GraphQLString) },
  },
  outputFields: {
    user: { type: UserType, resolve: user => user },
    id: {
      type: GraphQLString,
      resolve: ({ id }) => id
    },
    name: {
      type: GraphQLString,
      resolve: ({ name }) => namE
    },
    username: {
      type: GraphQLString,
     resolve: ({ username }) => username
    },
    email: {
      type: GraphQLString,
      resolve: ({ email }) => email
    },
    twitterUsername: {
      type: GraphQLString,
      //may be twitter_username from bd
      resolve: ({ twitterUsername }) => twitterUsername
    },
    youtubeUsername: {
      type: GraphQLString,
      resolve: ({ youtubeUsername }) => youtubeUsername

    },
    instagramUsername: {
      type: GraphQLString ,
      resolve: ({ instagramUsername }) =>instagramUsername
    },
    interests: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ interests }) => interests
    }
  },
  mutateAndGetPayload: (data) => {
    console.log("applicantHasBeenAcceptedMutation data");
    console.log(data);
    let { id } = data;
    // Must use .save, #1 error when debugging
    let user = User.findById(id)
      .then(user =>  user.set(data) );
    return user;
  }
})

// mutations needed now
// influencerUploadsContent
// delete account
//

// mutations needed later
// mutation viewerFollowsInfluencer - idk following is future

export {
  CreateNewUserMutation,
  applyForInfluencerMutation,
  applicantHasBeenAcceptedMutation,
  updateUserDataMutation
};
