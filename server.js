const express = require('express');
const app     = express();
const path    = require('path');
const fs      = require('fs');

app.set('port', (process.env.PORT || 3030));

// Setting gandi variables
// that vhosts need.
global.gandi = {};
global.gandi.i = 0;
global.gandi.app = app;

// For local development, you may specify which host
// should be used as follows: `node server.js vhost="LOCALPROJECT"`
var localProject;

process.argv.forEach(function (val, index, array) {
  var options = val.split('=');
  if (options.length && options[0].match(/^vhost$/i)) {
    localProject = options[1];
  }
});

// ExpressJS middleware that requires and call
// a project's index.js based on the HTTP request host.
app.use((req, res, next) => {
  global.gandi.i++;

  if (!('host' in req.headers))
    { showError(req, res); }

  var host = (localProject ? localProject : req.headers['host'].split(':')[0]);
  var vhost = path.join(__dirname, host);

  fs.access(vhost, fs.constants.R_OK, (err) =>
  {
    if (err) { showError (req, res); }
    else
    {
      global.gandi.request = req;
      global.gandi.response = res;

      var appVhost = require(vhost);
          appVhost(req, res, next);
    }
  });
});

// Setting up expressjs
// to listen on process port.
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

// Showing error
// if vhost is not specified or unknown
function showError (req, res)
{
  res.status(404);
  res.send('<!DOCYTPE html><html><body>Vhost is not specified or unknown - you may contact <a href="http://www.twitter.com/frenchcooc">@frenchcooc</a>\n');
}
