// Module dependencies
var Config 	= require('../config'),
	OAuth2 	= require('../../sellmate-utils').OAuth2;

var oa = new OAuth2(Config.client_id, Config.client_secret, Config.redirect_uri, Config.host_auth);

// Request coming from '/'
exports.index = function(req, res) {
	console.log("index router");
	var shop = '';
	if (req.session._shop) {
		shop = req.session._shop
	}
	res.render('index', {
		shop: shop,
		currentURL: '/'
	});
};

// Request coming from '/callback'
exports.callback = function(req, res) {
	var code = req.query['code'],
		nextUrl = req.query['state'],
		shop = req.query['shop'];
	console.log("Callback received with code: " + code + "and shop: " + shop);
	req.session._shop = shop;

	// Request an AccessToken
	oa.getAccessToken(code, {
		'shop': req.session._shop,
		'grant_type': Config.grant_type_auth,
	}, function(error, response, body) {
		console.log("Body: " + body);
		var json_body = JSON.parse(body);
		console.log("Status code: " + response.statusCode);
		if (response.statusCode == 200) {
			// Save the tokens
			req.session.oauth_access_token = json_body.access_token;
			req.session.oauth_mac_key = json_body.mac_key; // Important to create the mac auth header
			//req.session.oauth_refresh_token = json_body.refresh_token;
			//req.session.oauth_lifetime = new Date().getTime(); // Time of when the access token was generated

			res.redirect(nextUrl);
		} else {
			throw new Error('Failed to get Request Token. ' + json_body);
			// Do something else like requesting a new access_token or grant_code
		}
	});
};

// Request coming from '/products/page/:page([0-9]+)'
exports.products = function(req, res) {
	var page = parseInt(req.params.page);
	var pages = parseInt(req.count / Config.pageLimit) + ((req.count % Config.pageLimit)?1:0);

	if (page > pages) {
		throw new NotFound('Page not found.');
	} else {
		res.render('products', {
			title: 'Products',
			products: req.products,
			currentURL: req.path,
			current: page,
			pages: pages,
			productsCount: req.count
		});
	}
};

// Request coming from '/products/:productId'
exports.productId = function(req, res) {
	// Request comes from a precondition
	res.render('product', {
	    title: req.product.title,
	    currentURL: req.path,
		product: req.product,
		images: req.images
	});
};

// Request coming from '/collections'
exports.collections = function(req, res) {
	res.render('collections', {
	    title: 'Collections',
	    currentURL: req.path,
		collections: req.collections
	});	
};

// Request coming from '/collections/:collectionId'
exports.collectionId = function(req, res) {
	//var collectionId = req.params.collectionId;
	res.render('collection', {
	   	title: req.collection.title,
	   	currentURL: req.path,
		products: req.products,
		collection: req.collection
  	});	
};
