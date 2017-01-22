const search = require('./search');

module.exports = {
    init
};

function init(app, passport) {
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

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: '/',
            failureRedirect: '/failed_login' }));

    app.get('/feed',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res, next) {
            const body = req.body;
            search.feed({q: body.query, lang: 'en', count: 20}, passport._strategies.twitter._oauth);
        }
    );

    app.post('/compare',
        function (req, res, next) {
            const body = req.body;
            search.getTweets({q:body.query, lang:'en', count:20})
            .then(res.send);
        }
    );
}
