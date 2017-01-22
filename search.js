const appToken = require('./appToken');
const twitterCalls = require('./twitterCalls');
const sentimentAnalysis = require('./sentiment/sentimentAnalysis');
const OAuth = require('OAuth');
const Promise = require('bluebird');
const _ = require('lodash');
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
    return Promise.all(_.map(tweets, tweet => sentimentAnalysis.analyseText(tweet) ));
}

function analyseSentiments(tweets) {
    const list = {};
    list['positive'] = [];
    list['negative'] = [];
    _.forEach(tweets, tweet => {
       if (tweet['sentiment'] === 'positive') {
           list['positive'].push(tweet['text']);
       } else if (tweet['sentiment' === 'negative']) {
           list['negative'].push(tweet['text']);
       }
    });
    return list;
}

function reduceSentiment(list) {
    const positiveLen = list['positive'].length;
    const negativeLen = list['negative'].length;

    if (positiveLen > negativeLen) {
        _.take(list['positive'], negativeLen);
    } else if (negativeLen > positiveLen) {
        _.take(list['negative'], positiveLen)
    }
    return list;
}

function getTweets(params) {
    console.log(params);
    return getCall(twitterCalls.searchTweet, params)
    .then(analyseTweets)
    .then(analyseSentiments)
    .then(reduceSentiment);
}

function feed(params, userToken, userSecret) {
    console.log(params);
    getCall(twitterCalls.getTimeline, params)
    .then(tweets => console.log(tweets));
}