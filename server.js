var express = require('express')
var app = express()

app.get('/', function (req, res, next) {
  res.send('Hello World!!!')
})

app.post('/search', function (req, res, next) {
  const body = req.body;
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Express listening on port ' + process.env.PORT + ' or 3000');
})
