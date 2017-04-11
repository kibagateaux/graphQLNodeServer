import GraphHTTP from 'express-graphql';
import Express from 'express';
import cors from 'cors';
import Session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

import schema from './graphql';
import { User } from './db';

const app = Express();


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



app.use('/graphql', GraphHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))

app.listen(8080, () => {
   console.log("App listening on port 8080");
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
