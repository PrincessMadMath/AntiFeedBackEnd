const appToken = require('./appToken');
const twitterCalls = require('./twitterCalls');

module.exports = {
    tweets
};

function getCall(f, params) {
    return f(params, appToken.getToken())
}

function analyseTweets(tweets) {

}

function tweets(params) {
    console.log(params);
    getCall(twitterCalls.searchTweet, params)
    .then(tweet => console.log(tweet));
   // .then(analyseTweets)
   // .then()
}
