# Having multiple nodejs vhosts on Gandi's Simple Hosting
This repo helps you set up multiple nodejs vhosts on GANDI's Simple Hosting, using expressjs.

## Getting Started

As per [GANDI's documentation](https://wiki.gandi.net/en/simple/instance/nodejs), "Contrary to PHP instances, each creation of a vhost does not create a specific directory on your disk. The directory named “default” present in your vhosts allows you to manage the data for your Node.js instance. Only one instance of your application is executed, and must manage all the vhosts that you have associated to your Simple Hosting instance.".

So you can only have one main application, that will receive all HTTP requests and dispatched them to your different domain / directory, based the HTTP request "host" header.

### Installing

Replace default `server.js` on Simple Hosting instance with the one provided in this repo.
Run ```npm install expressjs```
Then add the following to each vhost's apps
```
if (global.gandi) { module.exports = app; app.listen = function () {}; }
```

### Local development
You may test the code locally by calling server.js as follows:
```
node server.js vhost="YOUR_APP_DIRECTORY"
```

### Troubleshootings
You may encounter the following error: `Error: listen EADDRINUSE :::3030`. It generally means that multiple listening events are triggered. To avoid the error, you should add this to your app/index.js: `if (global.gandi) { module.exports = app; app.listen = function () {}; }`.
