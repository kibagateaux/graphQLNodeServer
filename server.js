// "/" classic advertising landing page for platform,
// "/:username" is my full profile
  //tab="About Me"
// "/:username/:social-media"
  //tab="Socail Media"
// "/:username/me" dedicated to showcasing passion projects
  //tab="Hobbies"
// "/:username/live" stream current or past live broadcasts
  // tab = "????" maybe independent broadcast button for high traffic
// "/:username/adventure" unleash the wild
  // everyone travels, tell why I like traveling, my experiences
  // tab = "Malik's Adventures"
// "/:username/:agency" modeling portfolio
  // tab = "Model Portfolio"
// "/:username/"


// "/interests/:interest/:interest" gets
  //models with interests for shoot
// "/users" directory with intro gifs.
  // like snapchat avatar. fun, creative
import express from 'express';
import graphqlHTTP from 'express-graphql';
import override from 'method-override';
import parser from 'body-parser';
import { graphql } from 'graphql';

const pgp = require('pg-promise')();
const db = pgp('postgres://00y@localhost:5432/portfolio_website');

import schema from './graphql'

const app = express();

const port = 8080;

app.listen(port, function(){
  console.log("8080 vision");
});

// app.use(express.static(__dirname+'/public'));

app.use (override('_method'));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

//no cluewhat this does
app.use(parser.text({ type: 'application/graphql' }));

// app.engine('html',mustacheExpress());

app.set('view engine','html');
app.set('views',__dirname+'/views');



// The root provides a resolver function for each API endpoint
// const root = {
//   quoteOfTheDay: () => {
//     return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
//   },
//   random: () => {
//     return Math.random();
//   },
//   rollThreeDice: () => {
//     return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
//   },
// };

// const root = {
//   hello: () => "World",
//   user: (args) => {
//      console.log("Uou have queried users with args ", args);
//     return `Your name is ${name}`
//   },
//   login: ({email, password}) => {
//     return `You are logging in as ${email} with password ${password}`
//   }
// }

// GraphqQL server route
app.use('/graphql', graphqlHTTP(req => ({
  schema,
  pretty: true
})));

const userIDQuery = `{
                      user(id: 2){
                        name
                      }}`;
const basicUserQuery = `{ user(name: "Henry"){ name } }`;

const query = `{ hello }`
const props = { db }

graphql(schema, basicUserQuery, props).then(result => {

  console.log("The results of your GraphQl query are  ");
  console.log(result);

});

