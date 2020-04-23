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
        res.setHeader('Content-Type', 'image/png');
        res.end(result.result[0].PICTURE, 'binary');
      }
    },
    '/getUserData': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid'], res)) {
        let result = (await runQuery("SELECT NAME, GENDER, COURSE, DESCRIPTION, CREATED_DATE, PREF_SMOKE, PREF_MUSIC, PREF_TALK, PREF_TALK_MORNING FROM `USER` WHERE USER.FB_ID = ?", [options.fbid])).result[0]
        let data = {
          uid: options.fbid,
          name: result.NAME,
          gender: result.GENDER,
          course: result.COURSE,
          description: result.DESCRIPTION,
          createdAt: result.CREATED_DATE,
          prefs: {
            smoke: result.PREF_SMOKE,
            music: result.PREF_MUSIC,
            talk: result.PREF_TALK,
            talkMorning: result.PREF_TALK_MORNING
          }
        }
        res.end(JSON.stringify(data));
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
    '/createUserIfNotExisting': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'name', 'mail'], res)) {
        let users = (await runQuery("SELECT ID FROM `USER` WHERE USER.FB_ID = ?", [options.secretFbId])).result[0];
        if (!users) {
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

          await runQuery(
            "INSERT INTO `USER` (`ID`, `FB_ID`, `NAME`, `GENDER`, `COURSE`, `PICTURE`, `DESCRIPTION`, `CREATED_DATE`, `MAIL`, `PREF_SMOKE`, `PREF_MUSIC`, `PREF_TALK`, `PREF_TALK_MORNING`)" +
            "VALUES (NULL, ?, ?, 'X', '', ?, '', NULL, ?, 'RED', 'RED', 'RED', 'RED')",
            [options.secretFbId, options.name, png, options.mail]).catch(error => {
              throw error;
            });
          res.end("added")
        }
        res.end("existed")
      }
    },
    '/updateDescription': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'description'], res)) {
        await runQuery(
          "UPDATE `USER` SET `DESCRIPTION` = ? WHERE `USER`.`FB_ID` = ?",
          [options.description, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updateGender': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'gender'], res)) {
        await runQuery(
          "UPDATE `USER` SET `GENDER` = ? WHERE `USER`.`FB_ID` = ?",
          [options.gender, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updateProfilePicture': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'imageData'], res)) {
        var i = new Image()
        i.onload = function () {
          if (!(i.naturalHeight == 300 && i.naturalWidth == 300)) {
            res.writeHead(400)
            res.end("Wrong dimension")
            return
          }
          let blob = Buffer.from(options.imageData, "base64")
          await runQuery(
            "UPDATE `USER` SET `PICTURE` = ? WHERE `USER`.`FB_ID` = ?",
            [blob, options.secretFbId]).catch(error => {
              throw error;
            });
          res.end();
        }
        i.src = options.imageData
      }
    }
  }
}