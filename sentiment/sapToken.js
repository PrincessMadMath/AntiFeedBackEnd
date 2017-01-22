const base64 = require('base-64');
const TOKEN_URL = 'https://api.beta.yaas.io/hybris/oauth2/v1/token';
const APP_NAME = "bubbleburst";
const rp = require('request-promise');

let token;

module.exports = {
    renew,
    getToken
}

function renew(){
    console.log("Renewing SAP token.");
    const appKey = process.env.SAP_CLIENT_ID;
    const appSecret = process.env.SAP_CLIENT_SECRET;
    const credentials = appKey + ':' + appSecret;
    const encodedCredentials = 'Basic ' + base64.encode(credentials);
     var options = {
        method: "POST",
        uri: TOKEN_URL,
        headers: {
            'Authorization': encodedCredentials,
            'content-type': "application/x-www-form-urlencoded",
        },
        form: {
            "grant_type": "client_credentials",
            "scope": "" 
        },
        json: true 
    };

    return rp(options)
        .then(function (parsedBody) {
            let bufferSecond = 10;
            let expirationTime =  Date.now()/1000;
            token = {
                bearer: parsedBody.token_type + " " + parsedBody.access_token,
                isExpired: function(){
                    let currentTime = Date.now()/1000;
                    return (currentTime - expirationTime) > parsedBody.expires_in;
                }
            };
            return token;
        })
        .catch(function (err) {
            console.log("Unable to renew token");
            console.log(err);
        });
}

function getToken() {

    if(token === undefined || token.isExpired())
    {
        return renew();
    }
    return new Promise((fulfil, reject) => {
        fulfil(token);
    })
    
}