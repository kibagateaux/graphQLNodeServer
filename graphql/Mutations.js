import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLObjectType
} from 'graphql';
import db, { User } from '../db';

import { InfluencerType, UserType, VideoType } from './ModelTypes';

// var MutationType = new GraphQLObjectType({
//   name: 'GraphQL Mutations',
//   description: 'These are the things we can change',
//   fields: () => ({
//     createArticle: {
//       type: ArticleType,
//       description: 'Create a new article',
//       args: {
//         article: { type: ArticleInputType }
//       },
//       resolve: (value, { article }) => {
//         return ArticleServices.createArticle(article);
//       }
//     }
//   }),
// });

const CreateNewUserMutation = new GraphQLObjectType({
  name: 'CreateNewUserMutation',
  field: UserType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    name: { type: GraphQLString }
  },
  resolve: (data, props) => {
    // Q: how to give it an Influencer or User type?
    // in db there is no differentiaton
    // A: in GraphQL based on db column "is_influencer"
    const { name, username, email, interests } = data
    const user  = User.create({
      name, username, email
    })._boundTo.dataValues
     console.log("CreateNewUserMutation", user);
    return user ;
  },
});

// mutation hasApplied - adds s.media usernames, has_applied = true
const applyForInfluencerMutation = new GraphQLObjectType({
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
  resolve: (data) => {
    data.has_applied = true;
    const user = User.findById(id)
      .then(user => user.set(data))
    const updatedUser = user.save().then(user => user);

    return updatedUser;
  }

});

const applicantHasBeenAcceptedMutation = new GraphQLObjectType({
  name: "applicantHasBeenAcceptedMutation",
  description: "Applicant has been accpeted and is formally an 'influencer' ",
  inputFields: {
    isInfluencer: { type: GraphQLBoolean }
  },
  outputFields: {
    user: { type: UserType, resolve: user => user },
    isInfluencer: { type: GraphQLBoolean, resolve: user => user.is_influencer }
  },
  resolve: (data) => {
    console.log("applicantHasBeenAcceptedMutation data");
    console.log(data);
    let { id } = data;
    // Must use .save, #1 error when debugging
    const influencer = User.findById(id)
      .then(user =>  user.set({is_influencer: true}) );
    return influencer;
  }
})

const updateUserDataMutation = new GraphQLObjectType({
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
  resolve: (data) => {
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
