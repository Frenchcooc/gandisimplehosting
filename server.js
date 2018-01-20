const express = require('express');
const app     = express();
const path    = require('path');
const fs      = require('fs');

app.set('PRODUCTION', ((process.env.PORT) ? true : false));
app.set('port', (process.env.PORT || 3030));

global.gandi = {};
global.gandi.i = 0;
global.gandi.app = app;

app.use((req, res, next) =>
{
  global.gandi.i++;

  if ('host' in req.headers)
  {
    var host = (app.get('PRODUCTION') ? req.headers['host'] : 'stationf.ovh');
        host = host.split(':')[0];
        host = (app.get('PRODUCTION') ? host : '../' + host);

    var vhost = path.join(__dirname, host);

    fs.access(vhost, fs.constants.R_OK, (err) =>
    {
      if (err) { showError (req, res); }
      else
      {
        global.gandi.request = req;
        global.gandi.response = res;
        console.log('Vhost: ',vhost);
        console.log('URL: ', req.originalUrl);
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
