const rp = require('request-promise');
const SENTIMENT_URL = 'https://api.beta.yaas.io/sap/ta-sentiments/v1';
const APP_NAME = "bubbleburst";
var YaaS = require("yaas.js");

module.exports = {
    init,
    analyseText
};


function init()
{
    YaaS.init(
        process.env.SAP_CLIENT_SECRET,
        process.env.SAP_CLIEN_ID,
        "",
        APP_NAME
    )
    .then(function(response) {
        console.log("Success SAP!");
    }, function(reason) {
        console.log("Failed SAP!");
    });
}





function analyseText(text)
{

}


function post(text)
{
    var options = {
        method: "POST",
        uri: TWITTER_URL,
        headers: {
            'Authorization': "Bearer 022-a6c7f165-0fae-489b-85cc-16e578b4a56a",
            'Content-Type': 'application/json'
        },
        body: {
            "text": "While I love the lens on the new Nikon camera, I am not happy with the shutter speed settings."
        }
    };
}
