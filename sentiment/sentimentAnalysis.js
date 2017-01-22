const rp = require('request-promise');
const SENTIMENT_URL = 'https://api.beta.yaas.io/sap/ta-sentiments/v1';
const tokenManager = require('./sapToken');
const _ = require('lodash');
const factor = require('./factor.json');

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

function analyseResponse(text, response)
{
    let score = getSentimentScore(response.entities);

    if(score > factor.StrongTrigger)
    {
        return {
            "text": text,
            "sentiment": "positive",
            "strength" : "strong"
        }
    }

    if(score > factor.WeakTrigger)
    {
        return {
            "text": text,
            "sentiment": "positive",
            "strength" : "weak"
        }
    }

    if(score < factor.StrongTrigger)
    {
        return {
            "text": text,
            "sentiment": "negative",
            "strength" : "strong"
        }
    }

    if(score < -factor.WeakTrigger)
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

function getSentimentScore(entities)
{
    let score = 0;
    score += getScoreForPredicate(entities, factor.StrongPositive, strongPositiveDetector);
    score += getScoreForPredicate(entities, factor.StrongNegative, strongNegativeDetector);
    score += getScoreForPredicate(entities, factor.WeakPositive, weakPositiveDetector);
    score += getScoreForPredicate(entities, factor.WeakNegative, weakNegativeDetector);
    score += getScoreForPredicate(entities, factor.MinorProblem, minorProblemDetector);
    score += getScoreForPredicate(entities, factor.MajorProblem, majorProblemDetector);
    score += getScoreForPredicate(entities, factor.AmbigousProfanity, ambigousProfanityDetector);
    score += getScoreForPredicate(entities, factor.UnambigousProfanity, unAmbigousProfanityDetector);
    return score;
}

function getScoreForPredicate(entities, factor, predicate)
{
    let list = entities.filter(predicate)
    let listCount = list !== undefined ? list.length : 0;
    console.log(listCount + " : " + factor);
    return listCount * factor;
}

function strongPositiveDetector(entry)
{
    if(entry.text.toLowerCase().includes('trump'))
    {
        return false;
    }

    return entry.label.toLowerCase().includes("strongpositive");
}

function strongNegativeDetector(entry)
{
    if(entry.text.toLowerCase().includes('trump'))
    {
        return false;
    }

    return entry.label.toLowerCase().includes("strongnegative");
}

function weakPositiveDetector(entry)
{
    return entry.label.toLowerCase().includes("weakpositive");
}

function weakNegativeDetector(entry)
{
    return entry.label.toLowerCase().includes("weaknegative");
}


function minorProblemDetector(entry)
{
    return entry.label.toLowerCase().includes("minorproblem");
}

function majorProblemDetector(entry)
{
    return entry.label.toLowerCase().includes("majorproblem");
}

function ambigousProfanityDetector(entry)
{
    return entry.label.toLowerCase().includes("ambiguous_profanity");
}

function unAmbigousProfanityDetector(entry)
{
    return entry.label.toLowerCase().includes("unambiguous_profanity");
}





