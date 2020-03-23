const http = require('http');

var env = process.env.NODE_ENV;

const hostname = env === 'dev' ? 'dev.studicar.mfinn.de' : 'studicar.mfinn.de';

const port = 3000;

http.createServer(options, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
}).listen(port, hostname);