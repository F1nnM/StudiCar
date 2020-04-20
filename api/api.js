var runQuery = require('./db');

function isOptionMissing(data, needed, res) {
  return needed.some(key => {
    if (typeof data[key] == "undefined") {
      res.writeHead(400);
      res.end("No field '" + key + "' supplied!");
      return true;
    }
    return false;
  });
}

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
      if (!isOptionMissing(options, ['data'], res)) {
        let result = await runQuery("INSERT INTO `TEST` (`ID`, `data`) VALUES (NULL, ?)", options.data);
        res.write(JSON.stringify(result))
      }
    },
    '/addUser': async (req, res, options) => {
      if (!isOptionMissing(options, ['FbId', 'Name', 'Gender', 'Course', ], res)) {
        let result = await runQuery("INSERT INTO `TEST` (`ID`, `data`) VALUES (NULL, ?)", options.data || '');
        res.write(JSON.stringify(result))
      }
    }
  }
}