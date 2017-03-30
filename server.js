import GraphHTTP from 'express-graphql';
import Express from 'express';
import cors from 'cors';
import schema from './graphql';
import Passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
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
    secret: 'I will rule the world ... eventually',
    resave: false,
    saveUninitialized: false
}));

// Strategy defines how passport uses authentication
Passport.use(new LocalStrategy(
  (username, password, done) => {
    db.models.users.findAll({where: { username } }, (err, user) => {
      if (err) return err
      if (!user) {
        return  done(null, false, { message: 'Unknown user' });
      } else if (user.password != password) {
        return done(null, false, "Invalid email/password comnbinatrion");
      } else {
        return done(null, user);
      }
    })
      .catch(err => done(err))
  }));

Passport.serializeUser((user, done) => {
  done(null, user.id);
});

Passport.deserializeUser((id, done) => {
  User.findById(id).success((user) => {
    done(null, user);
  }).error((err) => {
    done(err, null);
  });
});



app.use(cors());

app.use('/graphql', GraphHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))

app.listen(8080, () => {
   console.log("App listening on port 8080");
});



app.post("/signup", function(req, res, next){
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
        passport.authenticate("local", {failureRedirect:"/signup", successRedirect: "/posts"})(req, res, next)
      })
    } else {
      res.send("user exists")
    }
  })
})

app.post('/register', (req, res, next) => {
    var { name, username, email, password } = req.body
     console.log("/register form");
      console.log(req.body);
    User.create({
      name, username, email, password, instagramUsername, youtubeUsername, twitterUsername
    }).catch(err => { console.log(err); return next(err); })

    // User.register(User.create({ username : username }), password, (err, user) => {
    //     if (err) {
    //       return res.render('register', { error : err.message });
    //     }

    Passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
});


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


export default { app, Express };
