var express = require('express')
var app = express()

const API_KEY = 

app.get('/', function (req, res, next) {
  res.send('Hello World!')
})

app.post('/search', function (req, res, next) {
  const body = req.body;
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
