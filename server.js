const express = require('express');
const app     = express();
const path    = require('path');
const fs      = require('fs');

app.set('port', (process.env.PORT || 3030));

global.gandi = {};
global.gandi.i = 0;
global.gandi.app = app;

app.use((req, res, next) =>
{
  global.gandi.i++;

  if ('host' in req.headers)
  {
    var host = req.headers['host'].split(':')[0];
    var vhost = path.join(__dirname, host);

    fs.access(vhost, fs.constants.R_OK, (err) =>
    {
      if (err) { showError (req, res); }
      else
      {
        var appVhost = require(vhost);
            appVhost(req, res, next);
      }
    });
  }
  else { showError (req, res); }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function showError (req, res)
{
  res.status(404);
  res.send('<!DOCYTPE html><html><body>Vhost is not specified or unknown :\'(');
}
