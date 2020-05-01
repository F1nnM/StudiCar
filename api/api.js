var runQuery = require('./db');

function isOptionMissing (data, needed, res) {
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
      if (!isOptionMissing(options, ['fbid', 'secretFbId'], res)) {
        let userData = (await runQuery("SELECT NAME, GENDER, COURSE, DESCRIPTION, CREATED_DATE, PREF_SMOKE, PREF_MUSIC, PREF_TALK, PREF_TALK_MORNING, LIFT_MAX_DISTANCE FROM `USER` WHERE USER.FB_ID = ?", [options.fbid])).result[0]
        let data = {
          uid: options.fbid,
          name: userData.NAME,
          gender: userData.GENDER,
          course: userData.COURSE,
          description: userData.DESCRIPTION,
          stats: {
            createdAt: userData.CREATED_DATE
          },
          prefs: {
            smoking: userData.PREF_SMOKE,
            music: userData.PREF_MUSIC,
            talk: userData.PREF_TALK,
            talkMorning: userData.PREF_TALK_MORNING
          }
        }
        if (options.secretFbId = options.fbid) {
          let liftCount = (await runQuery("SELECT COUNT(`LIFT_ID`) AS LIFT_COUNT FROM `LIFT_MAP` WHERE `USER_ID` = ? ", [options.fbid])).result[0].LIFT_COUNT
          let driverCount = (await runQuery("SELECT COUNT(`LIFT_ID`) AS DRIVER_COUNT FROM `LIFT_MAP` WHERE `IS_DRIVER` = true AND `USER_ID` = ? ", [options.fbid])).result[0].DRIVER_COUNT
          data.settings = {
            liftMaxDistance: userData.LIFT_MAX_DISTANCE
          }
          data.stats.liftsOffered = liftCount
          data.stats.driverCount = driverCount
          let adresses = await runQuery("SELECT POSTCODE, CITY, STREET, NUMBER FROM address INNER JOIN user ON address.USER_ID = user.ID WHERE user.FB_ID = ?", [options.fbid]);
          data.adresses = []
          adresses.result.forEach(item => {
            let obj = {
              postcode: item.POSTCODE,
              city: item.CITY,
              street: item.STREET,
              number: item.NUMBER
            }
            data.adresses.push(obj)
          })
          let cars = await runQuery("SELECT BRAND, MODEL, TYPE, LICENSE_PLATE, SEATS, COLOR FROM car INNER JOIN user ON car.USER_ID = user.ID WHERE user.FB_ID = ?", [options.fbid]);
          data.cars = []
          cars.result.forEach(item => {
            let obj = {
              brand: item.BRAND,
              model: item.MODEL,
              type: item.TYPE,
              plate: item.LICENSE_PLATE,
              seats: item.SEATS,
              color: item.COLOR
            }
            data.cars.push(obj)
          })
        }

        res.end(JSON.stringify(data))
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

          let size = 300
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
    '/updateLiftMaxDistance': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'liftMaxDistance'], res)) {
        await runQuery(
          "UPDATE `USER` SET `LIFT_MAX_DISTANCE` = ? WHERE `USER`.`FB_ID` = ?",
          [options.liftMaxDistance, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
      else {
        console.log('Problem')
      }
    },
    '/updateProfilePicture': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'imageData'], res)) {
        console.log(options.imageData.substr(22).substr(0, 50))
        console.log(options.imageData.substr(0, 50))
        var img = Buffer.from(options.imageData.substr(22), 'base64');
        var dimensions = require('image-size')(img);
        if (!(dimensions.width == 300 && dimensions.height == 300)) {
          res.writeHead(400);
          res.end("Image must be 300x300");
        }
        let blob = Buffer.from(options.imageData, "base64")
        await runQuery(
          "UPDATE `USER` SET `PICTURE` = ? WHERE `USER`.`FB_ID` = ?",
          [blob, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    }
  }
}