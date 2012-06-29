// Module dependencies
var Config = require('../config'),
	Rest = require('../../sellmate-utils').Rest;

exports.load = function (collectionId, req, callback) {
	var target = Config.shopUrl + req.session._shop + '/rest/collections/' + collectionId;
	console.log(target);

	var rest = new Rest(target, req);
	rest.GET(callback);
}

exports.count = function (req, callback) {	
	var target = Config.shopUrl + req.session._shop + '/rest/collections/count';	
	console.log(target);
	
	var rest = new Rest(target, req);
	rest.GET(callback);
}

exports.list = function (page, limit, req, callback) {
	// We can query the collections by requesting only the necessary fields
	var target = Config.shopUrl + req.session._shop + '/rest/collections' + '?fields=id,title,featured_image,num_of_products&limit=' + limit + '&page=' + page;
	console.log(target);

	var rest = new Rest(target, req);
	rest.GET(callback);
}
