import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLObjectType
} from 'graphql';
import { DB, User } from '../db';
import { UserType } from './ModelTypes';
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

export const CreateNewUserMutation = new GraphQLObjectType({
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
    const { name, username, email, interests } = data;
    const user  = User.create({
      name, username, email
    })._boundTo.dataValues
     console.log("CreateNewUserMutation", user);
    return user ;
  },
});

export const updateUserDataMutation = new GraphQLObjectType({
  name: "updateUserDataMutation",
  description: "Updates user data in database for given fields",
  inputFields:{
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
  outputFields: {
    user: { type: UserType, resolve: user => user },
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
    }
  },
  resolve: (data) => {
    console.log('update user mutation', data);
    let { username } = data;
    // Must use .save, #1 error when debugging
    let user = User.findOne({where: username})
      .then(user =>  user.set(data) );
    return user;
  }
})

// other mutations her
// delete account...
