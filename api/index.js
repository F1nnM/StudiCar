var server;

if (typeof (PhusionPassenger) !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
  var http = require('http');
  server = http.createServer();
} else {
  var https = require('https');
  const fs = require('fs');

  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.pem')
  };

  server = https.createServer(options);
}

var admin = require("firebase-admin");

var serviceAccount = require("./firebaseAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

      if (!options.idtoken) {
        res.writeHead(401);
        res.end;
        break;
      }
      admin.auth().verifyIdToken(options.idtoken)
        .then(async decodedToken => {
          options.secretFbId = decodedToken.uid;
          await api.GET[urlParts.pathname](req, res, options);
        })
        .catch(err => { throw err })

      break;
    case "POST":
      if (!api.POST[urlParts.pathname]) {
        res.writeHead(404);
        res.end();
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

        if (!options.idtoken) {
          res.writeHead(401);
          res.end;
          return;
        }
        admin.auth().verifyIdToken(options.idtoken)
          .then(async decodedToken => {
            options.secretFbId = decodedToken.uid;
            await api.POST[urlParts.pathname](req, res, options);
          })
          .catch(err => { throw err })

      })
      break;
  }

});

if (typeof (PhusionPassenger) !== 'undefined') {
  server.listen('passenger');
} else {
  server.listen(443);
}
