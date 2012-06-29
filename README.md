sellmate-demo-node
==================

Demo application that allows to display products and categories for a shop from [www.sellmate.com](http://www.sellmate.com).

To help you access the resources of the Sellmate REST API, you can use the module [sellmate-utils](https://github.com/emmenko/sellmate-utils)


How to get started
==================

You need to create the `properties.js` file with the settings of the sellmate application that you want to test

```bash
$ cd sellmate-demo-node
$ touch properties.js
```

Then add the following code and fill the fields with your app's settings

```javascript
// Sellmate application settings
exports.settings = {
    client_id: '', // Your application client id
    client_secret: '', // Your application client secret
    redirect_uri: '' // Your application redirect URI (callback)
}
```

In progress...