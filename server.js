const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const appToken = require('./appToken');
const bodyParser = require('body-parser');
const secretCache = require('./SecretCache');
const app = express();
const search = require('./search');
const rp = require('request-promise');
const qs = require('querystring');
const _ = require('lodash');


passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_API_KEY,
      consumerSecret: process.env.TWITTER_API_SECRET,
      callbackURL: process.env.TWITTER_CB_URL
    },
    function(token, tokenSecret, profile, cb) {
      console.log(token);
      secretCache.add(profile.id, token, tokenSecret);
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

app.get('/', function (req, res, next) {
  res.status(200);
  res.send('Hello World!')
});

app.get('/failed_login', function (req, res, next) {
  res.status(403);
  res.send('Twitter authentication failed');
});

app.get('/login', function (req, res) {
  res.status(403);
  res.send('Twitter authentication required');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.post('/auth/twitter/callback', function(req, res){
  req.session.oauth_token = req.body.oauth_token;
  req.session.oauth_verifier = req.body.oauth_verifier;
  var options = {
    method: 'POST',
    uri: 'https://api.twitter.com/oauth/access_token',
    form: req.body,
    json: true
  };
  rp(options)
    .then(function (response) {
      // POST succeeded...
      var a = qs.parse(response);
      _.assign(req.session, a);
      res.sendStatus(200);
    })
    .catch(function (err) {
      // POST failed...
      console.log(err);
    });
});

app.get('/api/feed',
  function (req, res, next) {
    if (!req.session.oauth_access_token) {
      return res
        .sendStatus(403);
    }
    const body = req.body;
    search.feed(req.session.oauth_token, req.session.oauth_token_secret)
      .then(feed => res.send(feed));
  }
);

app.post('/api/compare',
  function (req, res, next) {
    const body = req.body;
    search.getTweets({q:body.query, lang:'en', count:100})
      .then(tweets => res.send(tweets));
  }
);


app.listen(process.env.PORT || 3000, function () {
  appToken.renew()
  .then(() => {
    console.log('Express listening on port ' + process.env.PORT + ' or 3000');
  });
});
