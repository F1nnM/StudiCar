if (typeof (PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

var express = require('express');
var app = express();
app.get('/', function (req, res) {
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});

if (typeof (PhusionPassenger) !== 'undefined') {
    app.listen('passenger');
} else {
    app.listen(3000);
}