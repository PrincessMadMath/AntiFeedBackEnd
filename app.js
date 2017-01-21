const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const appToken = require('appToken');
require('routes.js');
const app = express();

app.configure(() => {
  app.use(express.static('public'));
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'secret'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.API_KEY,
    consumerSecret: process.env.API_SECRET,
    callbackUrl: process.env.CB_URL
  },
  (token, tokenSecret, profile, done) => {
    console.log(token);
    console.log(tokenSecret);
    if (err) return done(err);
    done(null, user);
  }
)
