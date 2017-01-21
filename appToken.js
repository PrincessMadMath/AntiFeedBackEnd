const base64 = require('base-64');
const twitterCalls = require('./twitterCalls');

let token;

module.export = {
    renew,
    getToken
};

function renew() {
    const appKey = process.env.API_KEY;
    const appSecret = process.env.SECRET_KEY;
    const credentials = appKey + ':' + appSecret;
    const encodedCredentials = base64.encode(credentials);
    token = twitterCalls.renewToken(encodedCredentials);
}

function getToken() {
    return token;
}