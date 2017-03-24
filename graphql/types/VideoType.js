import {
  graphql,
  GraphQLSchema,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

import { InfluencerType } from './UserType';

import db from '../../db';

const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos for user viewing",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString)},
    author: {
      //needs to be type Influencer but impossible if defined in same file
      type: InfluencerType,
      resolve: (video) => {
        video.getInfluencer();
      }
    }
  }
});

export default VideoType
