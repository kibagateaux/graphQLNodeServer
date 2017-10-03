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
  updateUserDataMutation
} from './Mutations';

import {
  UserType,
  nodeField,
} from './ModelTypes';

import { DB } from '../db';

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "RootMutation function that generate side-effects",
  fields: () => {
    return {
      createNewUser: CreateNewUserMutation,
      updateUserData: updateUserDataMutation,
    }
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "RootQuery function that returns data",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      args: {
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
