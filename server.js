import express from 'express';
import graphqlHTTP from 'express-graphql';
import override from 'method-override';
import parser from 'body-parser';
import { graphql } from 'graphql';

import session from 'express-session';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

import { bcryptCompare } from './lib/auth/bcryptAuth';

import cors from 'cors';


const pgp = require('pg-promise')();
const db = pgp('postgres://00y@localhost:5432/portfolio_website');

import schema from './graphql'

const app = express();

const port = 8080;

app.listen(port, function(){
  console.log("port open on 8080");
});

// app.use(express.static(__dirname+'/public'));

// allows cors requests
app.use(cors({origin:true,credentials: true}));

app.use (override('_method'));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

//no cluewhat this does
app.use(parser.text({ type: 'application/graphql' }));

app.set('view engine','html');
app.set('views',__dirname+'/views');

app.use(session({
  secret: 'ModelsAreTheScumOfTheEarth',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post("/register", function(req,res){
  let { email, password, socialMediaWithPermissions } = req.body
  let {  Instagram, Twitter, Youtube } = socialMediaWithPermissions;
   console.log("/register request", req.body);
  db.none(`INSERT INTO users(
                             email,
                             password,
                             instagram_username,
                             twitter_username,
                             youtube_username,
                             social_media)
                      VALUES ($1, $2, $3, $4, $5, $6)`,
  [email, password, Instagram, Twitter, Youtube, Object.keys(socialMediaWithPermissions)])
});

app.post("/login", function(req,res){
  let { email, password } = req.body;
  db.one("SELECT * FROM users WHERE email = $1", [email])
    .then((user) => {
      bcryptCompare(password, user);
    })
});

app.post("/fblogin", function(req,res){
  let { userID, accessToken } = req.body;
  let user = db.one(
        "SELECT * FROM users WHERE facebook_id = $1",
        [userID]
      )
    .then(user => {
      console.log("logging in user with fb", user);
        db.one(
          "UPDATE users SET facebook_token=$1 WHERE facebook_id=$2 RETURNING *",
          [accessToken, userID])
          .then(updatedUser => {
            req.session.user = updatedUser
            res.send(req.session)
          })
    })
    .catch(err => {
      if(err.message === "No data returned from the query."){
        db.one(
          "INSERT INTO users(facebook_token, facebook_id) VALUES ($1, $2)",
          [accessToken, userID])
        .then(user => req.session.user = user)
      }
        console.log("error with /fblogin", err)
    })
});



// The root provides a resolver function for each API endpoint
// resolve is a key part of hooking the schema and types up
  // with an actual data storage and defines which data the
  //field will return.


// GraphqQL server route
app.use('/graphql', graphqlHTTP(req => ({
  schema,
  graphiql: true,
  pretty: true
})));


const userIDQuery = `{user(id: 2){name}}`;
const basicUserQuery = `{ users(id:2){ username } }`;
const query = `{hello}`;

//if you add rootValue as third then get Abstract UserType as undefined
graphql(schema, basicUserQuery).then(result => {

  console.log("The results of your GraphQl query are  ");
  console.log(result);

});

export { db }
