const rp = require('request-promise');
const SENTIMENT_URL = 'https://api.beta.yaas.io/sap/ta-sentiments/v1';
const tokenManager = require('./sapToken');
const _ = require('lodash');

module.exports = {
    analyseText
};



function analyseText(text)
{
    return post(text).then(res => {
        var sentimentAnalys = analyseResponse(text, res); 
        console.log(JSON.stringify(sentimentAnalys));
        return sentimentAnalys;
    });
}

function analyseResponse(text, response)
{
    let isStrongPositive = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("strongpositive")}) !== undefined;
    let isStrongNegative = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("strongnegative")}) !== undefined;
    let isWeakPositive = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("positive")}) !== undefined;
    let isWeakNegative = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("negative")}) !== undefined;

    if(isStrongPositive)
    {
        return {
            "text": text,
            "sentiment": "positive",
            "strength" : "strong"
        }
    }
    if(isStrongNegative)
    {
        return {
            "text": text,
            "sentiment": "negative",
            "strength" : "strong"
        }
    }
    if(isWeakPositive)
    {
        return {
            "text": text,
            "sentiment": "positive",
            "strength" : "weak"
        }
    }
    if(isWeakNegative)
    {
        return {
            "text": text,
            "sentiment": "negative",
            "strength" : "weak"
        }
    }

    return {
        "text": text,
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
