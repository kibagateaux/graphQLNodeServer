import GraphHTTP from 'express-graphql';
import Express from 'express';
import cors from 'cors';
import schema from './graphql';
import Passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from './db';
import Session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = Express();

app.use(Passport.initialize());
app.use(Passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(Session({
    secret: 'I will rule the world ... eventually'
}));

// Passport.use(new FacebookStrategy({
//     clientID: "167270610443413",
//     clientSecret: "2c88809a935f7659dad3e54fa265ff9e",
//     callbackURL: "http://localhost:8080/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ where: { facebookId: profile.id }}, function (err, user) {
//        console.log("error with Facebook login", err);
//       return cb(err, user);
//     });
//   }
// ));

// app.get('/auth/facebook',
//   Passport.authenticate('facebook'));

// app.get('/auth/facebook/callback',
//   Passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });


app.post("/fblogin", (req,res,next) => {
   console.log("/fblogin");
   console.log(req.body.data);
   var { userID, accessToken } = req.body.data;

   // api call to get fb data first
   // save email & username and userID
   User.findOrCreate({
     where: { facebookId: userID, username, email, name }
   });
   // if succesfully created api call to facebook for data
    // create session with new facebook data
   // req.session.user = fb data
   res.send("You have searched for fb user", req);

})


app.use(cors());

app.use('/graphql', GraphHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))

app.listen(8080, () => {
   console.log("App listening on port 8080");
});


app.get('/register', (req, res, next) => {
   console.log("getting '/register");
    // console.log(req);
    res.send("There is no register page")
})


app.post("/register", function(req, res, next){
   console.log("'/register hit with form data", req);
  var QLQ = `/graphql?query={influencers(username: ${req.body.username}){name videos{title}}}`
  User.findOne({
    where: {
     username: req.body.username
    }
  }).then(function(user){
    if(!user){
      User.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password)
      }).then(function(user){
        passport.authenticate("local", {failureRedirect:"/", successRedirect: QLQ})(req, res, next)
      })
    } else {
      res.send("user exists")
    }
  })
})


app.post('/login', Passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
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
