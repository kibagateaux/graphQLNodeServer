'use strict';
import fetch from 'node-fetch';
import { youtube } from './AuthService';

// youtube api docs
// https://github.com/google/google-api-nodejs-client/blob/master/apis/youtube/v3.js
class Youtube{

  constructor (key) {
    this.key = key;
  }

  baseRequest (extURL, params, func) {
    return (
      fetch(
       `https://www.googleapis.com/youtube/v3${extURL}`,
       { params }
      )
      .then(data => func(data))
      // .catch(err => console.log(err))
    )
  }

  setKey (key) { this.key = key }

  handleError(err){
     console.log("Error in Youtube API");
     console.log(err);
     return err
  }

  getUploadsPlaylistUrl (res) {
    return res.data.items[0].contentDetails.relatedPlaylists.uploads;
  }


  extractPlaylistVideoData (res) {
    return res.data.items.map(item =>{
      let { title, description, resourceId, thumbnails} = item.snippet;
      return {
        title,
        description,
        iframe: resourceId.videoId,
        thumbnail: thumbnails.high.url
      }
    })
  }

  //TODO make this work for any playlist
  getUploadVideos (username) {

    var uploadParams = {
      part: 'contentDetails',
      forUsername: username,
      key: this.key
    };

    var videos = this.baseRequest(
      '/channels',
      uploadParams,
      this.getUploadsPlaylistUrl
    ).then(url => {

      var playlistParams = {
        part: 'snippet',
        maxResults: 10,
        playlistId: url,
        key: this.key
      };

      return this.baseRequest(
        '/playlistItems',
        playlistParams,
        this.extractPlaylistVideoData
      );

    })

    return videos;

  }

// How do I get the etag of all their playlists?
// When they setup their account do I pull in all data (superficial)

 getPlaylistData (etag, callback) {
  // Create custom HTTP headers for the request to enable
  // use of eTags
  var headers = {};
  if (etag) {
    headers['If-None-Match'] = etag;
  }

  return youtube.playlists.list({
      part: 'id, snippet',
      etag,
      headers
    }, function (err, data, response) {
      if (err) {
        console.error('Error: ' + err);
      }
      if (data) {
        console.log("youtube API data from playlist",data);
      }
      if (response) {
        console.log('Status code: ' + response.statusCode);
      }
      const promise = new Promise((resolve, reject) => resolve(data))
       console.log("getPlaylistData promise", promise);
      return data? promise : response;
    });


}

async getChannel(username, cb){
  var channelParams = {
    part: 'contentDetails',
    forUsername: username,
  };

  let channel;
  // create callback that that uses channel id to get more data
  // e.g. getChannelSections or getShallowPlaylistData
  await youtube.channels.list(channelParams, (err, res) => {
     console.log("channel res", res);

    channel = res;
  });
   console.log("getChannel channel", channel);
  return new Promise((resolve, reject) => resolve(channel));
}

async getChannelSections(channelId, cb){
  const channelSectionParams = {
    part: 'contentDetails',
    channelId: channelId
  }
  //init so cb can change
  let sections;
  await youtube.channelSections.list(channelSectionParams, (err, res) => {
     console.log("channelSections res", res);
    sections = res;
  });

  console.log("getChannelSections sections", sections);

  return new Promise((resolve, reject) => resolve(sections))
}

async getChannelSectionsForUsername(username, res){

 console.log(this.getChannel(username));
 console.log(this.getChannel(username).then(res=>res));

  return this.getChannel(username).then(chan => {
    console.log("getChannelSectionsForUsername chan", chan);
     return this.getChannelSections(chan).then(sections => {
       console.log("getChannelSectionsForUsername sect", sections);
       res.send(sections)
     })
  });

  // return this.getChannel(username, (err, channel) => {
  //   if(err) return this.handleError(err);
  //    console.log("getChannel success res", channel);
  //   return this.getChannelSections(channel.items[0].id,
  //     (err, response) => {
  //       if(err) return this.handleError(err)
  //      console.log("getChannelSections res", response);
  //      const playlists = response.items.map(
  //       etag => this.getPlaylistData(etag))
  //      .then(playlists => playlists);
  //       console.log("playlist data");
  //        console.log(playlists);
  //       return res.send(playlists);
  //     })
  // actions are insert POST, delete DELETE, update PUT, list GET,
  // arg list = (params, options, callback)
  // if no option then callback can be passed as second

}



  // Will probably need functions for the following
    // get user data subscribers, total plays, plays per month etc)
    // get whole channel
    // get specifc playlist for their show

// Query on channel returns
  // list of playlists
  // their "recruitment" video
  // stats

// channelSection is a group of selected, representative videos
  // assuming this has been set up ...
  // can directly copy over for easier setup

// Most likely they will want specific playlists

}


export default new Youtube("AIzaSyCsXVWokdOHwdpkH6DjsrBT8REYU1aBYpI")
