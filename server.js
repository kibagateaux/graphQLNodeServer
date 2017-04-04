import GraphHTTP from 'express-graphql';
import Express from 'express';
import cors from 'cors';
import schema from './graphql';
import { User } from './db';
import Session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = Express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());


app.use(Session({
   secret: 'I will rule the world ... eventually',
}));

app.get("/fblogin", (req,res,next) => {
  console.log("/fblogin get");
  console.log(req)
  res.send("You have searched for fb user");
})

app.post("/fblogin", (req,res,next) => {
   console.log("/fblogin");

   var { userID, accessToken } = req.body.data;

   User.findOrCreate({
     where: { facebook_id: userID, facebook_access_token: accessToken }
   })
   .then(userData => {
      var user = userData[0].dataValues

      if(user && user.facebook_id === userID){
        res.send({ statusCode: 200 });
      }
   })
   .catch(err =>  console.log("/fblogin" ,err))
   // if succesfully created api call to facebook for data
    // create session with new facebook data
   // req.session.user = fb data

})



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
