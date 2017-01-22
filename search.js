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
    const p = _.map(tweets.statuses, tweet => sentimentAnalysis.analyseText(tweet) );
    return Promise.all(p);
}

function analyseSentiments(tweets) {
    const list = {};
    list['positive'] = [];
    list['negative'] = [];
    _.forEach(tweets, tweet => {
        console.log(tweet['sentiment']);
       if (tweet['sentiment'] === 'positive' && tweet['strength'] === 'strong') {
           list['positive'].push(tweet);
       } else if (tweet['sentiment'] === 'negative' && tweet['strength'] === 'strong') {
           list['negative'].push(tweet);
       }
    });
    return list;
}

function reduceSentiment(list) {
    const positiveLen = list['positive'].length;
    const negativeLen = list['negative'].length;
    console.log(positiveLen);
    console.log(negativeLen);

    if (positiveLen > negativeLen) {
        list['positive'] = _.take(list['positive'], negativeLen);
    } else if (negativeLen > positiveLen) {
        list['negative'] = _.take(list['negative'], positiveLen)
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