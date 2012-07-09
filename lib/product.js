// Module dependencies
var Config = require('../config'),
	Rest = require('sellmate-utils').Rest;

// Load a specific product
exports.load = function (productId, req, callback) {	
	var target = Config.shopUrl + req.session._shop + '/rest/products/' + productId;	
	console.log(target);

	var tokens = {
		mac_key: req.session.oauth_mac_key,
		access_token: req.session.oauth_access_token
	};
	var rest = new Rest(target, tokens);
	rest.GET(callback);
}

// Load images of a product
exports.loadImages = function (productId, req, callback) {	
	var target = Config.shopUrl + req.session._shop + '/rest/products/' + productId + '/images';	
	console.log(target);

	var tokens = {
		mac_key: req.session.oauth_mac_key,
		access_token: req.session.oauth_access_token
	};
	var rest = new Rest(target, tokens);
	rest.GET(callback);
}

// Get the number of products
exports.count = function (req, callback) {	
	var target = Config.shopUrl + req.session._shop + '/rest/products/count';	
	console.log(target);
	
	var tokens = {
		mac_key: req.session.oauth_mac_key,
		access_token: req.session.oauth_access_token
	};
	var rest = new Rest(target, tokens);
	rest.GET(callback);
}

// Get a list of products (by querying only specific properties)
exports.list = function (page, limit, req, callback) {
	// We can query the products by requesting only the necessary fields
	var target = Config.shopUrl + req.session._shop + '/rest/products' + '?fields=id,title,vendor,featured_image,variants&limit=' + limit + '&page=' + page;
	console.log(target);

	var tokens = {
		mac_key: req.session.oauth_mac_key,
		access_token: req.session.oauth_access_token
	};
	var rest = new Rest(target, tokens);
	rest.GET(callback);
}

// Get a list of products in a specific collection
exports.listByCollection = function (collectionId, req, callback) {
	var target = Config.shopUrl + req.session._shop + '/rest/products?collection=' + collectionId;
	console.log(target);
	
	var tokens = {
		mac_key: req.session.oauth_mac_key,
		access_token: req.session.oauth_access_token
	};
	var rest = new Rest(target, tokens);
	rest.GET(callback);	
}

// Create a product
exports.create = function(req, res, next) {
	var newProduct = {};
	newProduct.title = "TEST Product";
	newProduct.vendor = "vendor 1";
	// TODO: create valid product
	
	var payload = querystring.stringify(newProduct);

	var target = Config.shopUrl + '/rest/products';
	console.log(target);

	var tokens = {
		mac_key: req.session.oauth_mac_key,
		access_token: req.session.oauth_access_token
	};
	var rest = new Rest(target, tokens);
	rest.POST(payload, handler);
}
