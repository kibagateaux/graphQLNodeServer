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

// const schema = require ('./graphql');
import schema from './graphql'
const app = express();

const port = 8080;

app.listen(port, function(){
  console.log("8080 vision");
});

// app.use(express.static(__dirname+'/public'));

app.use (override('_method'));
app.use(parser.urlencoded({extended: false}));
// app.use(parser.json());
app.use(parser.text({ type: 'application/graphql' }));

// app.engine('html',mustacheExpress());

app.set('view engine','html');
app.set('views',__dirname+'/views');

// GraphqQL server route
app.use('/graphql', graphqlHTTP(req => ({
  schema,
  pretty: true
})));

