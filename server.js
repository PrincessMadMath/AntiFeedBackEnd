const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const appToken = require('./appToken');
const routes = require('./routes.js');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, function () {
  appToken.renew()
  .then(() => {
    console.log('Express listening on port ' + process.env.PORT + ' or 3000');
    routes.init(app);
  })
});
