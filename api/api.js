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
      res.end('pong');
    },
    '/sqlTest': async (req, res, options) => {
      let result = await runQuery("SELECT * FROM `TEST`");
      res.end(JSON.stringify(result));
    },
    '/profilePicture': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid'], res)) {
        let result = await runQuery("SELECT PICTURE FROM `USER` WHERE USER.FB_ID = ?", [options.fbid]);
        console.log(result);
        res.setHeader('Content-Type', 'image/png');
        res.end(result.result[0].PICTURE, 'binary');
      }
    }

  },
  'POST': {
    '/sqlTest': async (req, res, options) => {
      if (!isOptionMissing(options, ['data'], res)) {
        let result = await runQuery("INSERT INTO `TEST` (`ID`, `data`) VALUES (NULL, ?)", [options.data]);
        res.end(JSON.stringify(result))
      }
    },
    '/addUserIfNotExists': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid', 'name', 'mail'], res)) {
        var jdenticon = require("jdenticon")
        jdenticon.config = {
          lightness: {
            color: [0.31, 0.81],
            grayscale: [0.26, 0.90]
          },
          saturation: {
            color: 0.60,
            grayscale: 0.00
          },
          backColor: "#ffffffff"
        };

        let size = 200
        let png = jdenticon.toPng(options.name, size);

        console.log(options)

        let result = await runQuery(
          "INSERT INTO `USER` (`ID`, `FB_ID`, `NAME`, `GENDER`, `COURSE`, `PICTURE`, `DESCRIPTION`, `CREATED_DATE`, `MAIL`, `PREF_SMOKE`, `PREF_MUSIC`, `PREF_TALK`, `PREF_TALK_MORNING`)" +
          "VALUES (NULL, ?, ?, 'X', NULL, ?, '', NULL, ?, 'RED', 'RED', 'RED', 'RED')",
          [options.fbid, options.name, png, options.mail]).catch(error => {
            if (error.code == 'ER_DUP_ENTRY') {
              res.end("existed")
              console.log(error)
            } else {
              res.writeHead(500)
              res.end(error.message)
            }
          });
        res.end("added")
      }
    }
  }
}