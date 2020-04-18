if (typeof (PhusionPassenger) !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}

var http = require('http');
var server = http.createServer();
var api = require('./api');
server.on('request', async (req, res) => {
  //CORS -Stuff
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  //Header
  res.setHeader('Content-Type', 'text/json');

  var urlParts = require("url").parse(req.url);

  switch (req.method) {
    case "OPTIONS":

      res.writeHead(200);
      res.end();
      return;

    case "GET":

      if (!api.GET[urlParts.pathname]) {
        res.writeHead(404);
        res.end;
        break;
      }

      let options = {};
      if (urlParts.query) {
        let arguments = urlParts.query.split("&");
        arguments.forEach(arg => {
          let parts = arg.split("=");
          options[parts[0]] = (parts.length === 2 ? parts[1] : "");
        })
      }

      await api.GET[urlParts.pathname](req, res, options);
      res.end();

      break;

    case "POST":

      if (!api.GET[urlParts.pathname]) {
        res.writeHead(404);
        res.end;
        break;
      }

      let buffer = []
      req.on('data', chunk => {
        buffer.push(chunk)
      })
      req.on('end', async () => {
        let options = {};
        if (buffer.length > 0)
          options = JSON.parse(buffer);
        await api.POST[urlParts.pathname](req, res, options);
        res.end();
      })

      break;
  }

});

if (typeof (PhusionPassenger) !== 'undefined') {
  server.listen('passenger');
} else {
  server.listen(80);
}
