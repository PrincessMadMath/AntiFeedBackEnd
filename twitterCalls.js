const rp = require('request-promise');
const querystring = require('querystring');
const TWITTER_URL = 'https://api.twitter.com/';
const appToken = require('./appToken');

module.exports = {
    renewToken,
    searchTweet,
};

function renewToken(Authorization) {
    const body = 'grant_type=client_credentials';
    return post('oauth2/token', undefined, Authorization, body)
    .then(response => response.access_token);
}

function searchTweet(q, Authorization) {
    return get('1.1/search/tweets.json', q, Authorization);
}

function formatOptions(subUrl, params, Authorization) {
    const uri = TWITTER_URL + subUrl + '?' + querystring.stringify(params);
    const headers = {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization
    };
    return {uri, headers};
}

function errorCheck(err) {
    console.log('Error: ' + err)
    /*if (err.errors.code == 89) {
        appToken.renew();
        //throw
    }*/
}

/**
 *
 * @param subUrl
 * @param params Parameters. Must be a json object
 * @param Authorization
 * @param body
 * @returns {Promise.<T>|*}
 */
function post(subUrl, params, Authorization, body) {
    const options = formatOptions(subUrl, params, Authorization);
    options['body'] = body;
    return rp.post(options)
    .then(response => JSON.parse(response))
    .catch(errorCheck);
}

/**
 *
 * @param subUrl
 * @param params Parameters. Must be a json object
 * @param Authorization
 * @returns {Promise.<T>|*}
 */
function get(subUrl, params, Authorization) {
    const options = formatOptions(subUrl, params, Authorization);
    console.log(options);
    return rp.get(options)
    .then(response => JSON.parse(response))
    .catch(errorCheck);
}