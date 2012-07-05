sellmate-demo-node
==================

Demo application that shows how to use the [Sellmate REST API](http://www.sellmate.com) to get/display products and collections of a shop.

To help you access the resources of the Sellmate REST API, you can use the module [sellmate-utils](https://github.com/emmenko/sellmate-utils).

Check out our live [example](http://sellmate-demo.nodester.com/) hosted on nodester.


How to get started
==================

1. Clone this project
	```bash
	$ mkdir sellmate-demo-node
	$ cd sellmate-demo-node
	$ git clone git://github.com/emmenko/sellmate-demo-node.git
	```

2. You need to edit the `properties.js` file with the settings of the sellmate application that you want to test

	```bash
	$ cd sellmate-demo-node
	$ vim properties.js
	```

	Then fill the fields with your app's settings

	```javascript
	// Sellmate application settings
	exports.settings = {
	    client_id: '', // Your application client id
	    client_secret: '', // Your application client secret
	    redirect_uri: '' // Your application redirect URI (callback)
	}
	```
3. Run the app and connect it to a shop

	```bash
	$ cd sellmate-demo-node
	$ node app.js
	```

NB: tokens will only be saved in the session. In a real app we reccomend to save the tokens (e.g. you can save the refresh token the first time the Merchant logs in or your app callback is called with the Request token to avoid that next time he needs to log in again)

