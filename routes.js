const search = require('./search');
const magic = require('./magic/magic');
const _ = require('lodash');
const Promise = require('bluebird');

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

    // From a # will return 2 feeds: one in the same bubble, the other one the opposite bubble
    app.post('/api/bubble',
        function (req, res, next) {
            const tag = req.body.query;
            const bubbleAnalysis = magic.getOppositeHashTag(tag);
            Promise
                .join(getBubble(bubbleAnalysis.positive), getBubble(bubbleAnalysis.negative))
                .spread((positive, negative) => {
                    res.send({ positive,negative })
                });
        }
    );
}


function getBubble(tags)
{
    var maps = _.map(tags, element => search
        .getTweets({q:element, land:"en", cound:30})
        .then(res => [...res.positive, ...res.negative])
    );
    return Promise
        .all(maps)
        .then(res => {
            return res;
        });
}