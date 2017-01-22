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
    let isPositive = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("positive")}) !== undefined;
    let isNegative = _.find(response.entities, function(o) { 
        return o.label.toLowerCase().includes("negative")}) !== undefined;

    if(isPositive)
    {
        return {
            "text": text,
            "sentiment": "positive"
        }
    }
    if(isNegative)
    {
        return {
            "text": text,
            "sentiment": "negative"
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
