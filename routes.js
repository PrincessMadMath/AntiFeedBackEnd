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

    app.get('/api/feed',
        //require('connect-ensure-login').ensureLoggedIn(),
        function (req, res, next) {
            const body = req.body;
            search.feed(req.user.id)
            .then(feed => res.send(feed))
            .catch(() => {
                res.status(403);
                res.send('User not authenticated');
            })
        }
    );

    app.post('/api/compare',
        function (req, res, next) {
            const body = req.body;
            search.getTweets({q:body.query, lang:'en', count:100})
            .then(tweets => res.send(tweets));
        }
    );
}
