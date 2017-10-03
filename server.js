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
}));

app.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});