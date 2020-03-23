const http = require('http');

var env = process.env.NODE_ENV;

const hostname = env === 'dev' ? 'dev.studicar.mfinn.de' : 'studicar.mfinn.de';

const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});