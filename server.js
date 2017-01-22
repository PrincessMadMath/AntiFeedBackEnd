const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const appToken = require('./appToken');
const routes = require('./routes.js');
const bodyParser = require('body-parser');
const app = express();


passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_API_SECRET,
      callbackURL: process.env.TWITTER_CB_URL
    },
    function(token, tokenSecret, profile, cb) {
      return cb(null, profile);
    }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('morgan')('combined'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
// parse application/json
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(process.env.PORT || 3000, function () {
  appToken.renew()
  .then(() => {
    console.log('Express listening on port ' + process.env.PORT + ' or 3000');
    routes.init(app, passport);
  })
});
