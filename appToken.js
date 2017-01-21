const base64 = require('base-64');
const twitterCalls = require('./twitterCalls');

let token;

module.exports = {
    renew,
    getToken
};

function renew() {
    const appKey = process.env.TWITTER_API_KEY;
    const appSecret = process.env.TWITTER_SECRET_KEY;
    const credentials = appKey + ':' + appSecret;
    const encodedCredentials = 'Basic ' + base64.encode(credentials);
    return twitterCalls.renewToken(encodedCredentials)
    .then(newToken => {
        token = newToken;
    });
}

function getToken() {
    return token;
}