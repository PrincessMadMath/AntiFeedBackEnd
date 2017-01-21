const search = require('./search');

app.get('/', function (req, res, next) {
    res.send('Hello World!')
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/',
        failureRedirect: '/login' }));

app.post('/search', function (req, res, next) {
    const body = req.body;
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    appToken.renew();
});
