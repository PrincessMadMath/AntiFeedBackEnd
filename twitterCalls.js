const rp = require('request-promise');
const querystring = require('querystring');
const TWITTER_URL = 'https://api.twitter.com/';

module.exports = {
    renewToken
};

function renewToken(credentials) {
    const Authorization = 'basic ' + credentials;
    return post('oauth2/token', undefined, Authorization);
}

function formatOptions(subUrl, params, Authorization) {
    const url = TWITTER_URL + subUrl + '?' + querystring.stringify(params);
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'grand_type': 'client_credentials',
        Authorization
    };
    return {url, headers};
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
    const options = formatUrl(subUrl, params, Authorization);
    options['body'] = body
    return rp.post(options)
    .catch(err => console.log(err));
}

/**
 *
 * @param subUrl
 * @param params Parameters. Must be a json object
 * @param Authorization
 * @returns {Promise.<T>|*}
 */
function get(subUrl, params, Authorization) {
    const options = formatUrl(subUrl, params, Authorization);
    return rp.get(options)
    .catch(err => console.log(err));
}