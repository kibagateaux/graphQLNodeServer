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
// import { InstagramType } from './SocialMediaModels';
import YoutubeChannelType from './Models/Youtube';
import { youtube } from '../lib/utils/AuthService';

const resolveType = (data) => {
  console.log("resolveType");
  console.log(data);

  if(data.instagramUsername) return InfluencerType;

  if(data.username) return UserType;

  if(data.mediaType) {
    return data.mediaType === "video"? VideoType : ImageType
  }
};


// User Definitions

const UserType = new GraphQLInterfaceType({
  name: "UserTypeInterface",
  description: "Interface for all users",
  fields: () => {
    return {
      id: { type: GraphQLInt },
      username: { type: GraphQLString },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      facebook_id: { type: GraphQLString },
      facebook_access_token: { type: GraphQLString },
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
      id:           { type: GraphQLInt },
      username:     { type: GraphQLString },
      name:         { type: GraphQLString },
      email:        { type: GraphQLString },
      profile_img:  { type: GraphQLString },
      facebook_id:  { type: GraphQLString },
      facebook_access_token: { type: GraphQLString },
      interests:    { type: new GraphQLList(GraphQLString) },
      hasAgency:    { type: GraphQLString },
      agencyName:   { type: GraphQLString },
      bio:          { type: GraphQLString },
      // followers: {
      //   type: new GraphQLList(UserType)
      //   // resolve: (influ) => db.models.user.findAll({where: id: influ.followers })
      // },

      // Social Media
      twitter_username: { type: GraphQLString },
      instagram: {
        type: InstagramType,
        resolve: (influ) => {
          // this is proper search but needs API Auth
          return fetch(
            `https://www.instagram.com/${influ.dataValues.instagram_username}/media`
          ).then(res => res).catch(err => console.log(err))
        }
      },
      // youtubeChannel: {
      //   type: YoutubeChannelType,
      //   description: "Youtube channel belonging to this influencer",
        // resolve to /auth/google/ ?
        // should not be necessary after first auth with refresh tokens

        // So save channel id in their db and send in req to youtube api?
        // resolve: ({dataValues}) => fetch()
      // },
      instagram_username: { type: GraphQLString },
      youtube_username:   { type: GraphQLString },
      youtube: {
        type: YoutubeChannelType,
        resolve: (influ) => {
          let channel;

          let cb = function(err, res){
             console.log("pre sres", res);
            channel = res;
             console.log("post chan", channel);
            return channel;
          };

          let channelRequest = () => youtube.channels.list(
            {
              part: 'contentDetails',
              forUsername: influ.youtube_username
            }, cb
          );

          setTimeout(() =>  console.log("timeout channel", channel), 2000);

          let promise = new Promise(async (resolve, reject) => {
            resolve(await channelRequest);
            // reject( console.log("Your Youtube channelRequest failed") ) });
          });

          // wrap cb in promise and set channel in .then
          // or return the whole promise which is suggested for GQL
          const data = channel? channel : promise.then(res => {
            return channel
          }).catch(err =>  console.log("err", err))

           console.log("data before return", data.then(res => res));

           //return data.items[0] which is actual channel data
          return async () => {
            const d = await data.then(res => res);
             console.log("awaited d", d);
             return d
          };

        }
      },
      videos: {
        type: new GraphQLList(VideoType),
        description: "Videos authored by Influencer",
        resolve: (user, args) => user.getVideos()
      }
    }
  }
});




// Visual Media Definitions

const MediaType = new GraphQLInterfaceType({
  name: "MediaType",
  description: "Media created by Influencers",
  fields: () => ({
      id:           { type: GraphQLInt },
      caption:      { type: GraphQLString },
      // type should be new GQL Enum
      media_type:   { type: GraphQLString },
      source_url:   { type: GraphQLString },
      tags:         { type: new GraphQLList(GraphQLString) },
      author:       { type: InfluencerType }
   }),
  resolveType: resolveType
});


const VideoType = new GraphQLObjectType({
  name: "VideoType",
  description: "Videos created by Influencers",
  interfaces: [MediaType],
  fields: () => ({
      id:          { type: GraphQLInt },
      caption:     { type: GraphQLString },
      media_type:  {
                     type: GraphQLString,
                     description: "Whether it is video or image"
                   },
      source_url:  { type: GraphQLString },
      tags:        { type: new GraphQLList(GraphQLString) },
      author:      {
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
      id:           { type: GraphQLInt },
      caption:      { type: GraphQLString },
      media_type:   {
                      type: GraphQLString,
                      description: "Whether it is video or image",
                    },
      source_url:   {
                      type: GraphQLString,
                      resolve: i => i.source_url
                    },
      tags:         { type: new GraphQLList(GraphQLString) },
      author:       {
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
  // playists: {
  //   type: new GraphQLList(YoutubePlaylistType),
  //   resolve: () => youtube.playlists.list(channelID)
  // },
  // owner:


// })

// const YoutubePlaylistType = new GraphQLObjectType({



// })

// const  YoutubeVideoType = new GraphQLObjectType({



// })

// instagram is a dick and you NEED OAuth for any data even public
// better focus on youtube
const InstagramType = new GraphQLObjectType({
  name: "InstagramType",
  description: "Instagram Social Media",
  fields: () => ({
    profile_img:    {
                      type: new GraphQLNonNull(GraphQLString),
                      resolve: (user) => user.profile_pic_url_hd
                    },
    external_url:   { type: GraphQLString },
    images:         {
                      type: new GraphQLList(ImageType),
                      resolve: (user) =>{
                        return user.data.user.media.nodes.map(x => ({
                          source_url: x.display_src,
                          likes:      x.likes.count,
                          caption:    x.caption,
                        }))
                      }
                    },
    bio:            {
                      type: GraphQLString,
                      resolve: ({biography}) => biography
                    },
    follower_count: {
                      type: new GraphQLNonNull(GraphQLInt),
                      resolve: ({followed_by}) => parseInt(followed_by.count)
                    },
    is_verified:    { type: new GraphQLNonNull(GraphQLBoolean) },
    username:       { type: new GraphQLNonNull(GraphQLString) }
  })
});


export { VideoType, MediaType, UserType, InfluencerType }
