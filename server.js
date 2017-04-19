import GraphHTTP from 'express-graphql';
import Express from 'express';
import cors from 'cors';
import Session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

import schema from './graphql';
import { User } from './db';
import Youtube from './lib/utils/Youtube';
import google, { oauth2Client, youtube } from './lib/utils/AuthService';

const app = Express();

app.listen(8080, () => {
   console.log("App listening on port 8080");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(Session({
   secret: 'I will rule the world ... eventually',
   resave: false,
   saveUninitialized: true,
   cookie: { secure: false }
}));

app.use('/graphql', GraphHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))


app.post("/fblogin", (req,res,next) => {
   console.log("/fblogin");

   var { userID, accessToken } = req.body.data;

   User.findOrCreate({
     where: { facebook_id: userID, facebook_access_token: accessToken }
   })
   .then(userData => {
      var user = userData[0].dataValues
      if(user && user.facebook_id === userID){
        req.session = { user: { id: userID } };
        res.send({ statusCode: 200 });
      }
   })
   .catch(err =>  console.log("/fblogin" ,err))
   // if succesfully created api call to facebook for data
    // create session with new facebook data
   // req.session.user = fb data
});


app.get("/insta", (req,res,next) => {
  fetch('https://www.instagram.com/malikwormsby/?__a=1')
  .then(data => data.json())
  .then(json => res.send(json));
});


app.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.get("/youtube/:username", (req,res,next) => {
  // when inputing youtube username ask if channel or user.
  // in req we take username and Channel/User switch to change search

  // TODO
    // when inputing youtube username ask if channel or user.
    // in req we take username and Channel/User switch to change search

    // check if thy are signed into google then procceed accrodingly
    // throw error immediatley if no google auth
    // how to even check google api directly?
   console.log(google.auth);
   console.log("_________------------___________________---------");

  //gets profile's top-level channel
   console.log("getting youtube channel for " + req.params.username);
  youtube.channels.list({
    part: 'contentDetails', forUsername: req.params.username
  },
    (err, chan) => {
      // For KSIO he has no channel so how do we handle users vs. channels?
       console.log("youtube chan", chan);
       //get videos in profile's uploads as default
       // eventually will be determined based on profile settings
      youtube.playlistItems.list({
        part: 'snippet',
        playlistId: chan.items[0].contentDetails.relatedPlaylists.uploads
      },
        (err, items) => res.send(items)
      )
    })
});



// OAuth on client side i.e. current setup
// https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps

// OAuth on server
// https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps

app.get("/auth/google/callback", (req,res,next) => {

  const code = req.query.code;

  oauth2Client.getToken(code, function (err, tokens) {
    if (err) {
      return cb(err);
    }
    // sets tokens to the client
    oauth2Client.setCredentials(tokens);
    //figure out how to change redirect based on where the req cam from
    // e.g. req.url.query or req.[blah]
    res.redirect("http://localhost:3000");
  });

});






