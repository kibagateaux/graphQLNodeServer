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
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import { CreateNewUserMutation } from './Mutations';
import { InfluencerType, VideoType, nodeField } from './ModelTypes';
import db from '../db';

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "RootMutation function that creates changes",
  fields: () => {
    return {
      createNewUser: CreateNewUserMutation
    }
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "RootQuery function that returns data",
  fields: () => {
    return {
      node: nodeField,
      influencers: {
        type: new GraphQLList(InfluencerType),
        args: {
          id: {type: GraphQLInt},
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
        resolve: (root, {id}) => {
          id = Number.parseInt(id);
          return db.models.video.findAll({ where: id })
        }
      }
    }
  }
})

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})
