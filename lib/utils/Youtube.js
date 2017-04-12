'use strict';
import axios from 'axios';

class Youtube{

  constructor(key){
    this.key = key;
  }

  baseRequest(extURL: string, params: any, func){
    return (
      axios.get(
       `https://www.googleapis.com/youtube/v3${extURL}`,
       { params }
      )
      .then(data => func(data))
      // .catch(err => console.log(err))
    )
  }

  setKey(key){ this.key = key }

  getUploadsPlaylistUrl(res){
    return res.data.items[0].contentDetails.relatedPlaylists.uploads;
  }


  extractPlaylistVideoData(res){
    return res.data.items.map(function(item){
      let { title, description, resourceId, thumbnails} = item.snippet;
      return{
        title,
        description,
        iframe: resourceId.videoId,
        thumbnail: thumbnails.high.url
      }
    })
  }

  //TODO make this work for any playlist
  async getUploadVideos(username: string){

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
