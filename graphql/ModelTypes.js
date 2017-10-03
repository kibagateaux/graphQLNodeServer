import fetch from 'node-fetch';

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLString,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql';


//import PageInfoType from relay
// https://github.com/graphql/graphql-relay-js/blob/master/src/connection/connectiontypes.js

import { DB, User, Video } from '../db';

const resolveType = (data) => {
  if(data.username) return UserType;
};


// User Definitions

export const UserType = new GraphQLInterfaceType({
  name: "UserTypeInterface",
  description: "Interface for all users",
  fields: () => {
    return {
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
    }
  },
  resolveType: resolveType
});
