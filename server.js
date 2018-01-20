const express = require('express');
const app     = express();
const path    = require('path');
const fs      = require('fs');

app.set('port', (process.env.PORT || 3030));

global.gandi = {};
global.gandi.i = 0;
global.gandi.app = app;

var currentProject = "stationf.ovh";

app.use((req, res, next) =>
{
  global.gandi.i++;

  if ('host' in req.headers)
  {
    var host = req.headers['host'].split(':')[0];
        host = (host == "localhost" ? ("../" + currentProject ) : host)

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
  }
  else { showError (req, res); }
});

app.listen(app.get('port'), function() { console.log('Node app is running on port', app.get('port')); });

function showError (req, res)
{
  res.status(404);
  res.send('<!DOCYTPE html><html><body>Vhost is not specified or unknown - you may contact <a href="http://www.twitter.com/frenchcooc">@frenchcooc</a>\n');
}
