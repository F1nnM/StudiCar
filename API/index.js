if (typeof (PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

var http = require('http');

var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Hello World");
});

if (typeof (PhusionPassenger) !== 'undefined') {
    server.listen('passenger');
} else {
    server.listen(8080);
}