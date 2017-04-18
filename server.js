import GraphHTTP from 'express-graphql';
import Express from 'express';
import cors from 'cors';
import Session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

import schema from './graphql';
import { User } from './db';
import AuthService, { oauth2Client, youtube } from './lib/utils/AuthService';


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

// OAuth on client side i.e. current setup
// https://developers.google.com/youtube/v3/guides/auth/client-side-web-apps

// OAuth on server
// https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps

app.get("/youtube", (req,res,next) => {
   console.log("/youtube");

    const channel = youtube.channels.list({
      part: "contentDetails",
      //instead of mine should be forUsername with param username
      mine: true
    }, (err, response) => {
      if(err) { console.log("youtube channel API err", err); return; }
       console.log("channel cb response");
        console.log(response.items);
        const channelSections = youtube.channelSections.list({
          part: 'contentDetails',
          channelId: response.items[0].id
        }, (err, response) => {
          if(err){  console.log("youtube channelSection API err", err); return; }
           console.log("channelSections cb");
            console.log(response);
            res.send(response.items)

        })
    });

});

app.get("/auth/google/callback", (req,res,next) => {
 console.log("google auth");

  const code = req.query.code;

  const cb = (tokens) => {
    console.log("Google Auth tokens", tokens);
  }

  oauth2Client.getToken(code, function (err, tokens) {
    if (err) {
      return cb(err);
    }

    // sets tokens to the client
    oauth2Client.setCredentials(tokens);
    cb(tokens);
    res.redirect("http://localhost:3000")
  });

});






