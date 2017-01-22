const rp = require('request-promise');
const SENTIMENT_URL = 'https://api.beta.yaas.io/sap/ta-sentiments/v1';
const tokenManager = require('./sapToken');
const _ = require('lodash');

module.exports = {
    analyseText
};



function analyseText(tweet)
{
    const text = tweet.text;
    return post(text).then(res => {
        var sentimentAnalys = analyseResponse(tweet, res);
        console.log(JSON.stringify(sentimentAnalys));
        return sentimentAnalys;
    });
}

function analyseResponse(tweet, response)
{
    let isStrongPositive = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("strongpositive")}) !== undefined;
    let isStrongNegative = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("strongnegative")}) !== undefined;
    let isWeakPositive = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("positive")}) !== undefined;
    let isWeakNegative = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("negative")}) !== undefined;
    const text = tweet.text;
    const name = tweet.user.name;
    const handle = tweet.user.screen_name;
    const retweets = tweet.retweet_count;
    const profileUrl = tweet.user.profile_image_url_https;
    const hashtags = _.map(tweet.entities.hashtags, ht => ht.text);

    if(isStrongPositive)
    {
        return {
           text,
            name,
            handle,
            retweets,
            hashtags,
            profileUrl,
            "sentiment": "positive",
            "strength" : "strong"
        }
    }
    if(isStrongNegative)
    {
        return {
           text,
            name,
            handle,
            retweets,
            hashtags,
            profileUrl,
            "sentiment": "negative",
            "strength" : "strong"
        }
    }
    if(isWeakPositive)
    {
        return {
           text,
            name,
            handle,
            retweets,
            hashtags,
            profileUrl,
            "sentiment": "positive",
            "strength" : "weak"
        }
    }
    if(isWeakNegative)
    {
        return {
           text,
            name,
            handle,
            retweets,
            hashtags,
            profileUrl,
            "sentiment": "negative",
            "strength" : "weak"
        }
    }

    return {
       text,
        name,
        handle,
        retweets,
        hashtags,
        profileUrl,
        "sentiment": "neutral"
    }
}


function post(text)
{
    return tokenManager.getToken().then(token =>{
        console.log("Token: " + token.bearer);
        var options = {
                method: "POST",
                uri: SENTIMENT_URL,
                headers: {
                    'Authorization': token.bearer,
                    'Content-Type': 'application/json'
                },
                body: {
                    "text": text 
                },
                json: true 
            };

            return rp(options)
                .then(function (parsedBody) {
                    return parsedBody;
                })
                .catch(function (err) {
                    if (err.status == 401) {
                        console.log("Token expired!");
                        appToken.renew();
                        //throw
                    }
                    else{
                        console.log("Unhandle error: " + err);
                    }
                    
        });
    }
    );     
}
