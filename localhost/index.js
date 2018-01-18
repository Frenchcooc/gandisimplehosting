const express  = require('express');
const app      = express();
const path     = require('path');

app.set('port', (process.env.PORT || 3030));

/***********************************************************
 * GANDI SIMPLE HOSTING VHOST
 ***********************************************************/

if (global.gandi) { module.exports = app; app.listen = function () {}; }

/***********************************************************
 * Routes
 ***********************************************************/

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get("/", function (req, res, next) { res.send('It works!'); });

/*
 * END ROUTES */

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
