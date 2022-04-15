require('dotenv').config()

var server;

if (process.env.USE_HTTPS=="true"){
  var https = require('https');
  const fs = require('fs');

  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.pem')
  };

  server = https.createServer(options);
} else {
  var http = require('http');
  server = http.createServer();
}

var admin = require("firebase-admin");

var serviceAccount = {
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var api = require('./api');
server.on('request', async (req, res) => {
  // CORS -Stuff
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Header
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
        res.end();
        break;
      }

      admin.auth().verifyIdToken(options.idtoken)
        .then(async decodedToken => {
          options.secretFbId = decodedToken.uid;
          await api.GET[urlParts.pathname](req, res, options, admin);
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
          res.end();
          return;
        }
        admin.auth().verifyIdToken(options.idtoken)
          .then(async decodedToken => {
            options.secretFbId = decodedToken.uid;
            await api.POST[urlParts.pathname](req, res, options, admin);
          })
          .catch(err => { throw err })

      })
      break;
  }

});


server.listen(443);
