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

import db, { User, Video, Media } from '../db';



const resolveType = (data) => {
   console.log("resolveType");
    console.log(data);

  if(data.instagramUsername) return InfluencerType;

  if(data.username) return UserType;

  if(data.mediaType) {
    return data.mediaType === "video"? VideoType : ImageType
  }
};


// Interfaces

const UserType = new GraphQLInterfaceType({
  name: "UserTypeInterface",
  description: "Interface for all users",
  fields: () => {
    return {
      id: { type: GraphQLInt },
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      facebookId: { type: GraphQLString },
      facebookAccessToken: { type: GraphQLString },
      // these are custom interests pertaining to our product
      // for an exhaustive list use FB or Google user data
      interests: { type: new GraphQLList(GraphQLString) }
    }
  },
  resolveType: resolveType
});

const InfluencerType = new GraphQLObjectType({
  name: "InfluencerType",
  description: "Influencer using our services",
  interfaces: [UserType],
  fields: () => {
    return {
      // Basic user information
      id: { type: GraphQLInt },
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      profileImage: {
        type: GraphQLString,
        resolve: (influ) => influ.profile_img
      },
      facebookId: { type: GraphQLString },
      facebookAccessToken: { type: GraphQLString },
      interests: { type: new GraphQLList(GraphQLString) },
      hasAgency: { type: GraphQLString },
      agencyName: { type: GraphQLString },
      bio: { type: GraphQLString },
      // followers: {
      //   type: new GraphQLList(UserType)
      //   // resolve: (influ) => db.models.user.findAll({where: id: influ.followers })
      // },

      // Social Media
      twitterUsername: {
        type: GraphQLString,
        resolve: (influ) => influ.twitter_username
      },
      // instagram: {
      //   type: InstagramType,
      //   resolve: (influ) =>
      //     fetch(
      //       `https://www.instagram.com/
      //       ${influ.instagramUsername}/?__a=1`
      //     ).then(res => res).catch(err => console.log(err))
      // },
      instagramUsername: {
        type: GraphQLString,
        resolve: (influ) => influ. instagram_username
      },
      youtubeUsername: {
        type: GraphQLString,
        resolve: (influ) => influ. youtube_username
      },

      videos: {
        type: VideoType,
        description: "Videos authored by Influencer",
        resolve: (user, args) =>
          user.getVideos()
      },
      media: {
        type: MediaType,
        description: "Media authored by Influencer",
        resolve: (user, args) =>
          user.getMedia()
      }
    }
  }
});


// Visual Media
const MediaType = new GraphQLInterfaceType({
  name: "MediaType",
  description: "Media created by Influencers",
  fields: () => ({
      id: { type: GraphQLInt },
      caption: { type: GraphQLString },
      // type should be new GQL Enum
      mediaType: { type: GraphQLString },
      sourceUrl: { type: GraphQLString },
      tags: { type: new GraphQLList(GraphQLString) },
      author: { type: InfluencerType }
   }),
  resolveType: resolveType
});


const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos created by Influencers",
  interfaces: [MediaType],
  fields: () => ({
      id: { type: GraphQLInt },
      caption: { type: GraphQLString },
      mediaType: {
        type: GraphQLString,
        description: "Whether it is video or image",
        resolve: v => v.media_type
      },
      sourceUrl: {
        type: GraphQLString,
        resolve: v => v.source_url
      },
      tags: { type: new GraphQLList(GraphQLString) },
      author: {
        type: InfluencerType,
        description: "Author of the video",
        resolve: (video, args) =>
          db.models.user.findAll({
            where: { id : video.userId }
          })
      }
   })
});

const ImageType = new GraphQLObjectType({
  name: "ImageType",
  description: "Images of users",
  fields: () => ({
      id: { type: GraphQLInt },
      caption: { type: GraphQLString },
      mediaType: {
        type: GraphQLString,
        description: "Whether it is video or image",
        resolve: i => i.media_type
      },
      sourceUrl: {
        type: GraphQLString,
        resolve: i => i.source_url
      },
      tags: { type: new GraphQLList(GraphQLString) },
      author: {
        type: InfluencerType,
        description: "Author of the Image",
        resolve: (i, args) =>
          db.models.user.findAll({
            where: { id : i.userId }
          })
      }
   })
});

// Social Media
// Un poco complicated, cannot return JS object in GQL
// must destructure entire user profile


// const YoutubeChannelType = new GraphQLObjectType({



// })

// const YoutubePlaylistType = new GraphQLObjectType({



// })

// const  YoutubeVideoType = new GraphQLObjectType({



// })

// const InstagramType = new GraphQLObjectType({
//   name: "InstagramType",
//   description: "Instagram Social Media",
//   fields: () => ({
//     images: {
//       type: new GraphQLList(ImageType),
//       resolve: (profile) =>
//         profile.data.user.media.nodes.map(x => ({
//           sourceUrl:x.display_src,
//           likes:x.likes.count,
//           alt:x.caption,
//         }))
//     },
//     profile: { type: }

//   })
// })


export { VideoType, MediaType, UserType, InfluencerType }
