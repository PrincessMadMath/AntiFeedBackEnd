const search = require('./search');

module.exports = {
    init
};

function init(app) {
    app.get('/', function (req, res, next) {
        res.send('Hello World!')
    });

   /* app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', { successRedirect: '/',
            failureRedirect: '/login' }));
*/
    app.post('/compare', function (req, res, next) {
        const body = req.body;
        search.tweets({q:body.query, lang:'en', count:20});
    });
}
