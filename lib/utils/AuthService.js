import google from 'googleapis';
import readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const OAuth2 = google.auth.OAuth2;

export const oauth2Client = new OAuth2(
  "450709045221-k205emhut5oh7l7jr0delan4d5iauq5o.apps.googleusercontent.com",
  "pcJQkTDJLtUnoF5P8ZeAkfoB",
  "http://localhost:8080/auth/google/callback"
);

// set auth as a global default
google.options({
  auth: oauth2Client
});

// not necessary with global option above
// just to ensure usage of 'v4'
export const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

// generate a url that asks permissions for Google+ and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/youtube'
];



export function getAccessToken (oauth2Client=oauth2Client, callback) {
  // generate consent page url
   console.log("getting Access Token");
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes,

    // Optional property that passes state parameters to redirect URI
    // state: { foo: 'bar' }
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function (code) {
    // request access token
    oauth2Client.getToken(code, function (err, tokens) {
      if (err) {
        return callback(err);
      }

      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}













// retrieve an access token
export const accessTokenCall = getAccessToken(oauth2Client, () => {
  // retrieve user profile
  let cb = function (err, data, response) {
      if (err) {
        console.error('Error: ' + err);
      }
      if (data) {
        console.log("Youtube API data", data);
      }
      if (response) {
        console.log('Status code: ' + response.statusCode);
      }
      callback(err, data, response);
  }

  function getPlaylistData (etag, callback) {
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
    }, cb);
  }

    getPlaylistData(null, cb);

});






