const standsInfo = require("./deepLearned.json");
const _ = require('lodash');

module.exports = {
    getOppositeTweet,
    getOppositeHashTag
};


function getOppositeTweet(tweetAnalysis)
{
    var oppositeStandInfo = calculateOppositeStands(tweetAnalysis.hashtags, tweetAnalysis.sentiment);

    if(oppositeStandInfo != -1)
    {
        var oppositeStand = findStand(oppositeStandInfo.standName);
        return {
            "sentimentToGet" : oppositeStandInfo.sentiment,
            "hashTags" : oppositeStand.related
        };
    }

    return {
        "sentimentToGet" : "",
        "hashTags" : []
    };
}

function getOppositeHashTag(hashtags)
{
    let currentStand = findStandByHashTag(hashtags);
    
    if(currentStand != undefined)
    {
        let oppositeStandInfo = findStand(currentStand.oppositeStand);
        return {
                "positive" : currentStand.related,
                "negative" : oppositeStandInfo.related
            }
        
    }
    
    return [];
}

function findStandByHashTag(hashtags)
{
    let bestIntersectCount = 0;
    let stand;

    var lowerHashTags = _.map(hashtags, function(s){
        return  s.toLowerCase();
    });

    standsInfo.stands.forEach(function(element) {
        var intersect = _.intersection(element.related, lowerHashTags);
        if(intersect.length >= bestIntersectCount)
        {
            stand = element;
            bestIntersectCount = intersect.length;
        }
    });

    return stand;
}

function calculateOppositeStands(hashtags, tweetSentiment)
{
    var currentStand = findStandByHashTag(hashtags);

    if(currentStand !== undefined)
    {
        console.log("Your stand: " + tweetSentiment + " to " + currentStand.name);
        if(tweetSentiment === "positive")
        {
            return {
                "standName": currentStand.oppositeStand,
                "sentiment": "positive"
            }
        }
        else{
            return {
                "standName": currentStand.oppositeStand,
                "sentiment": "negative"
            }
        }
    }

    return -1;
}

function findStand(standName)
{
    var stand = _.find(standsInfo.stands, function(o) { return o.name === standName; });
    return stand;
}
