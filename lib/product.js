// Module dependencies
var Config = require('../config'),
	Rest = require('../../sellmate-utils').Rest;


exports.load = function (productId, req, callback) {	
	var target = Config.shopUrl + '/rest/products/' + productId;	
	console.log(target);

	var rest = new Rest(target, req);
	rest.GET(callback);
}

exports.loadImages = function (productId, req, callback) {	
	var target = Config.shopUrl + '/rest/products/' + productId + '/images';	
	console.log(target);

	var rest = new Rest(target, req);
	rest.GET(callback);
}

exports.count = function (req, callback) {	
	var target = Config.shopUrl + '/rest/products/count';	
	console.log(target);
	
	var rest = new Rest(target, req);
	rest.GET(callback);
}

exports.list = function (page, limit, req, callback) {
	// We can query the products by requesting only the necessary fields
	var target = Config.shopUrl + '/rest/products' + '?fields=id,title,vendor,featured_image,variants&limit=' + limit + '&page=' + page;
	console.log(target);

	var rest = new Rest(target, req);
	rest.GET(callback);
}

exports.listByCollection = function (collectionId, req, callback) {
	var target = Config.shopUrl + '/rest/products?collection=' + collectionId;
	console.log(target);
	
	var rest = new Rest(target, req);
	rest.GET(callback);	
}

exports.create = function(req, res, next) {
	var newProduct = {};
	newProduct.title = "TEST Product";
	newProduct.vendor = "vendor 1";
	// TODO: create valid product
	
	var payload = querystring.stringify(newProduct);

	var target = Config.shopUrl + '/rest/products';
	console.log(target);

	var rest = new Rest(target, req);
	rest.POST(payload, handler);
}
