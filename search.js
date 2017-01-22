const appToken = require('./appToken');
const twitterCalls = require('./twitterCalls');
const sentimentAnalysis = require('./sentiment/sentimentAnalysis');
const secretCache = require('./SecretCache');
const OAuth = require('oauth');
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
    feed,
};

function getCall(f, params) {
    return f(params, appToken.getToken())
}

function analyseTweets(tweets) {
    if (!tweets) {
        return [];
    }
    if (tweets.statuses) {
        tweets = tweets.statuses;
    }
    if (tweets[0] instanceof Array) {
        tweets = tweets[0];
    }
    if (!tweets instanceof Array) {
        return [];
    }
    const p = tweets.map(tweet => {
        return sentimentAnalysis.analyseText(tweet);
      });
    return Promise.all(p);
}

function analyseTweetsNoBreak(tweets) {
    if (tweets[0]  instanceof Array) {
        tweets = tweets[0];
    }
    const p = _.map(tweets, tweet => sentimentAnalysis.analyseText(tweet));
    return Promise.all(p);
}

function analyseSentiments(tweets) {
    const list = {};
    list['positive'] = [];
    list['negative'] = [];
    _.forEach(tweets, tweet => {
       //console.log(tweet['sentiment']);
       if (tweet['sentiment'] === 'positive') {
           list['positive'].push(tweet);
       } else if (tweet['sentiment'] === 'negative') {
           list['negative'].push(tweet);
       }
    });
    return list;
}

function reduceSentiment(list) {
    const positiveLen = list['positive'].length;
    const negativeLen = list['negative'].length;
    //console.log(positiveLen);
    //console.log(negativeLen);

    if (positiveLen > negativeLen) {
        list['positive'] = _.take(list['positive'], negativeLen);
    } else if (negativeLen > positiveLen) {
        list['negative'] = _.take(list['negative'], positiveLen)
    }
    return list;
}

function getTweets(params) {
    //console.log(params);
    return getCall(twitterCalls.searchTweet, params)
    .then(analyseTweets)
    .then(analyseSentiments)
    .then(reduceSentiment);
}

function filterTweets(tweets, sentiments) {
    if (sentiments === 'positive') return tweets['negative'];
    else return tweets['positive'];
}

function getAntiTweet(params, sentiment) {
    return getCall(twitterCalls.searchTweet, params)
    .then(analyseTweetsNoBreak)
    .then(analyseSentiments)
    .then(filterTweets, sentiment);
}

function filterHT(feed) {
    const tweets = _.filter(JSON.parse(feed), tweet => tweet.entities.hashtags.length > 0);
    return analyseTweetsNoBreak(tweets);
}

function getAntiTweets(tweets) {
    let antiFeed = [];
    _.forEach(tweets, tweet => {
        _.forEach(tweet.hashtags, ht => {
            antiFeed.push(getAntiTweet({q:ht, lang:'en', count:80}, tweet.sentiment));
        });
    });
    return Promise.all(antiFeed);

}

function getFeed(token, tokenSecret) {
    return new Promise((fulfill, reject) => {
        oauth.get(
            'https://api.twitter.com/1.1/statuses/home_timeline.json',
            token,
            //you can get it at dev.twitter.com for your own apps
            tokenSecret,
            //you can get it at dev.twitter.com for your own apps
            function (e, data, res) {
                if (e) reject(e);
                fulfill(data);
            });
    })
}

function feed(token, tokenSecret) {
    return getFeed(token, tokenSecret)
    .then(filterHT)
    .then(getAntiTweets)
}