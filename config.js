var settings = require('./properties.js').settings;

exports.host_api = 'api.sellmate.com';
exports.host_auth = 'auth.sellmate.com';

exports.response_type = 'code';
exports.grant_type_auth = 'authorization_code';
exports.grant_type_refresh = 'refresh_token';
exports.client_id = settings.client_id;

exports.client_secret = settings.client_secret;
exports.redirect_uri = settings.redirect_uri;

exports.pageLimit = 25;

exports.shopUrl = 'http://' + this.host_api + '/';