// Module dependencies
var express     = require('express'),
    stylus      = require('stylus'),
    nib         = require('nib'),
    jade        = require('jade'),
    routes      = require('./routes'),
    Product     = require('./lib/product'),
    Collection  = require('./lib/collection'),
    Config      = require('./config'),
    OAuth2      = require('../sellmate-utils').OAuth2;

var oa = new OAuth2(Config.client_id, Config.client_secret, Config.redirect_uri, Config.host_auth);
/**
 * Create the server
 */
var app = module.exports = express.createServer();

/**
 * Server configuration
 */
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false }); // this will activate template inheritance in Express 2.x for Jade
    app.use(express.logger('dev'))
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(stylus.middleware({ 
        src: __dirname + '/public',
        compile: compile 
    }));
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: "adfasfkjbasdkjf"
    }));
    // Important: must be after session manager
    app.use(app.router);
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

/**
 * Define error handlers
 */
app.use(function(err, req, res, next) {
    if (err instanceof NotFound) {
        res.render('404', { 
            header: '#Header#',
            footer: '#Footer#',
            description: '',
            author: '',
            analyticssiteid: 'XXXXXXX',
            title : '404 - Not Found',
            status: 404, 
            layout: false
        });
    } else {
        res.render('500', {
            header: '#Header#',
            footer: '#Footer#',
            description: '',
            author: '',
            analyticssiteid: 'XXXXXXX',
            title : 'The Server Encountered an Error',
            error: err,
            status: 500, 
            layout: false   
        });
    }
});

/**
 * Configure environment settings
 */
app.configure('development', function(){
    console.log("using config for 'development'");
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    console.log("using config for 'production'");
    app.use(express.errorHandler({ dumpExceptions: true }));
});

// Compile CSS styles
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}


/**
 * Define app routes
 */
 app.all('/', function(req, res, next) {
    if (!req.session._shop) {
        console.log("rendering index");
        req.shop = 'You need to insert a shop to access'
    } else {
        console.log("shop: " + req.session._shop);
    }
    next();
});
app.get('/', routes.index);
app.get('/callback', routes.callback);
app.get('/products/page/:pageProd([0-9]+)', routes.products);
app.get('/products/:productId', routes.productId);
app.get('/products', function(req, res) {
    res.redirect('/products/page/1');
});
app.get('/collections/page/:pageColl([0-9]+)', routes.collections);
app.get('/collections/:collectionId', routes.collectionId);
app.get('/collections', function(req, res) {
    res.redirect('/collections/page/1');
});

app.post('/', function(req, res, next) {
    var shop = req.body.shop;
    console.log(shop);
    if (shop == '') {
        console.log("shop null...redirecting");
    } else {
        console.log("saving shop in session");
        req.session._shop = shop;
        req.session.oauth_access_token = null;
    }
    res.redirect('/');
});
// This will create a product and redirect to the his page
app.post('/products', Product.create, function(err, response, product) {
    if (response.statusCode == 200) {
        req.product = JSON.parse(product);
        res.redirect('/products/' + req.product.id);
    } else {
        return next(new Error('failed to find product'));
    }
});

// A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});
//The 404 Route (ALWAYS Keep this as the last route)
app.get('/*', function(req, res){
    throw new NotFound;
});


/**
 * Define preconditions
 */

function canFetchResource(req, res) {
    console.log("Checking auth_token...");
    if (!req.session.oauth_access_token) {
        var params = {
            state: req.path
        }
        console.log("checking shop in session: " + req.session._shop);
        if (req.session._shop) {
            params['shop'] = req.session._shop;
        }
        var authUrl = oa.getAuthorizeUrl(params);
        
        console.log("Getting auth url: " + authUrl);
        res.redirect(authUrl);
    } else
        return true;
}

// Fetch a product
app.param('productId', function(req, res, next, id) {
    console.log("Loading product with id: " + id);
    
    if (canFetchResource(req, res)) {
        Product.load(id, req, function(err, response, product) {
            if (response.statusCode == 200) {
                req.product = JSON.parse(product);
                next();
            } else {
                return next(new Error('failed to find product'));
            }
        });
    }
});
// Fetch the product images
app.param('productId', function(req, res, next, id) {
    console.log("Loading images for product with id: " + id);
    
    if (canFetchResource(req, res)) {
        Product.loadImages(id, req, function(err, response, images) {
            if (response.statusCode == 200) {
                req.images = JSON.parse(images);
                next();
            } else {
                return next(new Error('failed to find images'));
            }
        });
    }
});
// Count the products
app.param('pageProd', function(req, res, next, page) {
    
    if (canFetchResource(req, res)) {
        Product.count(req, function(err, response, count) {
            if (response.statusCode == 200) {
                req.count = JSON.parse(count);
                next();
            } else {
                return next(new Error('failed to count products'));
            }
        });
    } 
});
// Fetch the products
app.param('pageProd', function(req, res, next, page) {
    var limit = Config.pageLimit;
    
    if (canFetchResource(req, res)) {
        Product.list(page, limit, req, function(err, response, products) {
            if (response.statusCode == 200) {
                req.products = JSON.parse(products);
                next();
            } else {
                return next(new Error('failed to find product'));
            }
        });
    }
});


// Fetch a collection
app.param('collectionId', function(req, res, next, id) {
    console.log("Loading collection with id: " + id);
    
    if (canFetchResource(req, res)) {
        Collection.load(id, req, function(err, response, collection) {
            if (response.statusCode == 200) {
                req.collection = JSON.parse(collection);
                next();
            } else {
                return next(new Error('failed to find collection'));
            }
        });
    }
});
// Fetch products by a collection
app.param('collectionId', function(req, res, next, id) {
    console.log("Loading products in the collection with id: " + id);
    
    if (canFetchResource(req, res)) {
        Product.listByCollection(id, req, function(err, response, products) {
            if (response.statusCode == 200) {
                req.products = JSON.parse(products);
                next();
            } else {
                return next(new Error('failed to find products in the collection'));
            }
        });
    }
});
// Count the collections
app.param('pageColl', function(req, res, next, page) {
    
    if (canFetchResource(req, res)) {
        Collection.count(req, function(err, response, count) {
            if (response.statusCode == 200) {
                req.count = JSON.parse(count);
                next();
            } else {
                return next(new Error('failed to count collections'));
            }
        });
    } 
});
// Fetch the collections
app.param('pageColl', function(req, res, next, page) {
    var limit = Config.pageLimit;
   
    if (canFetchResource(req, res)) {
        Collection.list(page, limit, req, function(err, response, collections) {
            if (response.statusCode == 200) {
                req.collections = JSON.parse(collections);
                next();
            } else {
                return next(new Error('failed to find collection'));
            }
        });
    }
});


/**
 *  App port listener
 */
app.listen(8888, function(){
  console.log("Server listening on port 8888 in %s mode.\nhttp://localhost:8888", app.settings.env);
});
