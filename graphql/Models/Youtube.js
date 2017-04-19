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

import { InfluencerType } from '../ModelTypes';

import { youtube } from '../../lib/utils/AuthService';
import Youtube from '../../lib/utils/Youtube';

const YoutubeChannelType = new GraphQLObjectType({
  name: "YoutubeChannelType",
  args: {
    username: { type: GraphQLString },
    etag: { type: GraphQLString }
  },
  fields: () => ({
    channel:{
      type: YoutubeChannelType,
      resolve: (channel) => {
         console.log(channel);
          console.log(channel());
        return channel
      }
    },
    // playists: {
    //   type: new GraphQLList(YoutubePlaylistType),
    //     resolve: () => youtube.playlists.list(channelID)
    // },
    channel_sections: {
      type: new GraphQLList(ChannelSection),
      resolve: async (channel, args) => {
        console.log("channel_sections resolce");
        console.log(channel);
        let sections;
        await youtube.channelSections.list(
          {part: 'contentDetails', channelId: channel.channelId},
          (err, res) => { sections = res; return res; }
        );
        return sections
      }
    }
  })

})

const ChannelSection = new GraphQLObjectType({
  name: "YoutubeChannelSection",
  fields: () => ({
    etag: { type: new GraphQLNonNull(GraphQLString),
    resolve: (asyncFunc) => {
       console.log(asyncFunc());
       const channelData = asyncFunc()
    } },
    // contentDetails:

  })
})
// const YoutubePlaylistType = new GraphQLObjectType({



// })

// const  YoutubeVideoType = new GraphQLObjectType({

export default YoutubeChannelType;

