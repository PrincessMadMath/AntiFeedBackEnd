const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const appToken = require('./appToken');
require('./routes.js');
const app = express();

app.listen(process.env.PORT || 3000, function () {
  appToken.renew()
  .then(() => {
    console.log('Express listening on port ' + process.env.PORT + ' or 3000');
  })
});
