const appToken = require('./appToken');
const twitterCalls = require('./twitterCalls');
const OAuth = require('OAuth');
const oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_API_KEY,
    process.env.TWITTER_API_SECRET,
    '1.0A',
    null,
    'HMAC-SHA1'
);

module.exports = {
    getTweets,
    feed
};

function getCall(f, params) {
    return f(params, appToken.getToken())
}

function analyseTweets(tweets) {

}

function getTweets(params) {
    console.log(params);
    getCall(twitterCalls.searchTweet, params)
    .then(tweets => console.log(tweets));
   // .then(analyseTweets)
   // .then()
}

function feed(params, userToken, userSecret) {
    console.log(params);
    getCall(twitterCalls.getTimeline, params)
    .then(tweets => console.log(tweets));
}