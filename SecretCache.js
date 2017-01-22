const cache = {};

module.exports = {
    add,
    get
};

function add(id, token, tokenSecret) {
    cache[id] = {};
    cache[id]['token'] = token;
    cache[id]['tokenSecret'] = tokenSecret;
}

function get(id) {
    return cache[id];
}