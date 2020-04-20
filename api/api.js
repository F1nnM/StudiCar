var runQuery = require('./db');

module.exports = {
  'GET': {
    '/ping': (req, res, options) => {
      res.write('pong');
    },
    '/sqlTest': async (req, res, options) => {
      let result = await runQuery("SELECT * FROM `TEST`");
      res.write(JSON.stringify(result));
    }
  },
  'POST': {
    '/sqlTest': async (req, res, options) => {
      if (!options.data) {
        res.writeHead(400);
        res.end("No field 'data' supplied!");
      }
      let result = await runQuery("INSERT INTO `TEST` (`ID`, `data`) VALUES (NULL, ?)", options.data);
      res.write(JSON.stringify(result))
    },
    '/addUser': async (req, res, options) => {
      if (!options.data) {
        res.writeHead(400);
        res.end("No field 'data' supplied!");
      }
      let result = await runQuery("INSERT INTO `TEST` (`ID`, `data`) VALUES (NULL, ?)", options.data || '');
      res.write(JSON.stringify(result))
    }
  }
}