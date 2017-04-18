'use strict';
import axios from 'axios';
import youtube from './AuthService';

// youtube api docs
// https://github.com/google/google-api-nodejs-client/blob/master/apis/youtube/v3.js

class Youtube{

  constructor (key) {
    this.key = key;
  }

  baseRequest (extURL: string, params: any, func) {
    return (
      axios.get(
       `https://www.googleapis.com/youtube/v3${extURL}`,
       { params }
      )
      .then(data => func(data))
      // .catch(err => console.log(err))
    )
  }

  setKey (key) { this.key = key }

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
  async getUploadVideos (username: string) {

    var uploadParams = {
      part: 'contentDetails',
      forUsername: username,
      key: this.key
    };

    var url = await this.baseRequest(
      '/channels',
      uploadParams,
      this.getUploadsPlaylistUrl
    );

    var playlistParams = {
      part: 'snippet',
      maxResults: 10,
      playlistId: url,
      key: this.key
    };

    var videos = await this.baseRequest(
      '/playlistItems',
      playlistParams,
      this.extractPlaylistVideoData
    );

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

  youtube.playlists.list({
    part: 'id,snippet',
    id: 'PLIivdWyY5sqIij_cgINUHZDMnGjVx3rxi',
    headers: headers
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
    callback(err, data, response);
  });


}

getChannel(){
    var channelParams = {
    part: 'id',
    minde: true,
    key: this.key
  };
  // create callback that that uses channel id to get more data
  // e.g. getChannelSections or getShallowPlaylistData

  youtube.channels.list(channelParams)
}

getChannelSection(options){
  // actions are insert POST, delete DELETE, update PUT, list GET,
  // arg list = (params, options, callback)
  // if no option then callback can be passed as second
  youtube.channelSection.list()
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
