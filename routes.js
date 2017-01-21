const search = require('./search');

function init(app) {
    app.get('/', function (req, res, next) {
        res.send('Hello World!')
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: '/',
            failureRedirect: '/login' }));

    app.post('/search', function (req, res, next) {
        const body = req.body;
        search.general(body.query);
    });
}
