var runQuery = require('./db')
var carModels = require('./carModels')

function updateModels (req, res) {
  var cars = carModels.all()
  for (let brand in cars) {
    for (let type in cars[brand]) {
      cars[brand][type].forEach(async function (model) {
        let exists = (await runQuery("SELECT * FROM car_models WHERE BRAND = ? AND MODEL = ? AND TYPE = ?;", [brand, model, type])).result.length
        if (exists) {
          console.log('Model already exists: ' + brand + ' ' + model + ' (' + type + ')')
        }
        else {
          await runQuery("INSERT INTO `car_models` (`ID`, `BRAND`, `MODEL`, `TYPE`, `PICTURE`, `OFFICIAL`) VALUES (NULL, ?, ?, ?, NULL, '1');", [brand, model, type])

          console.log('Model has been inserted: ' + brand + ' ' + model + ' (' + brand + ')')
        }
      })
    }
  }
}

function isOptionMissing (data, needed, res) {
  return needed.some(key => {
    if (typeof data[key] == "undefined") {
      res.writeHead(400);
      res.end("No field '" + key + "' supplied!");
      console.log('Error occurred: missing property "' + key + '" at ' + data)
      return true;
    }
    return false;
  });
}

async function getUserId (fb_id) {
  let result = await runQuery("SELECT ID FROM users WHERE FB_ID = ?", [fb_id]).result[0]
  return result.ID
}

module.exports = {
  'GET': {
    '/ping': (req, res, options) => {
      res.end('pong');
    },
    '/sqlTest': async (req, res, options) => {
      let result = await runQuery("SELECT * FROM `test`");
      res.end(JSON.stringify(result));
    },
    '/profilePicture': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid'], res)) {
        let result = await runQuery("SELECT PICTURE FROM `users` WHERE users.FB_ID = ?", [options.fbid]);
        res.setHeader('Content-Type', 'image/png');
        res.end(result.result[0].PICTURE, 'binary');
      }
    },
    '/getUserData': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid', 'secretFbId'], res)) {
        let userData = (await runQuery("SELECT ID, NAME, GENDER, COURSE, DESCRIPTION, CREATED_DATE, PREF_SMOKING, PREF_MUSIC, PREF_TALK, PREF_TALK_MORNING, LIFT_MAX_DISTANCE FROM `users` WHERE users.FB_ID = ?", [options.fbid])).result[0]
        let liftCount = (await runQuery("SELECT COUNT(`LIFT_ID`) AS LIFT_COUNT FROM `lift_map` WHERE `USER_ID` = ? ", [options.fbid])).result[0].LIFT_COUNT
        let driverCount = (await runQuery("SELECT COUNT(`LIFT_ID`) AS DRIVER_COUNT FROM `lift_map` WHERE `IS_DRIVER` = true AND `USER_ID` = ? ", [options.fbid])).result[0].DRIVER_COUNT

        let data = {
          id: userData.ID,
          uid: options.fbid,
          name: userData.NAME,
          gender: userData.GENDER,
          course: userData.COURSE,
          description: userData.DESCRIPTION,
          stats: {
            createdAt: userData.CREATED_DATE,
            liftsOffered: liftCount,
            driverCount: driverCount
          },
          prefs: {
            smoking: userData.PREF_SMOKING,
            music: userData.PREF_MUSIC,
            talk: userData.PREF_TALK,
            talkMorning: userData.PREF_TALK_MORNING
          }
        }
        if (options.secretFbId = options.fbid) {

          let addresses = await runQuery("SELECT adresses.ID, adresses.NICKNAME, POSTCODE, CITY, STREET, NUMBER FROM adresses INNER JOIN users ON adresses.USER_ID = users.ID WHERE users.FB_ID = ? UNION SELECT adresses.ID, adresses.NICKNAME, POSTCODE, CITY, STREET, NUMBER FROM adresses WHERE adresses.ID < 4", [options.fbid]);
          data.addresses = []
          data.settings = {
            liftMaxDistance: userData.LIFT_MAX_DISTANCE
          }
          addresses.result.forEach(item => {
            let obj = {
              id: item.ID,
              nickname: item.NICKNAME,
              postcode: item.POSTCODE,
              city: item.CITY,
              street: item.STREET,
              number: item.NUMBER
            }
            data.addresses.push(obj)
          })
          let cars = await runQuery("SELECT car.MODEL_ID, car.ID, BRAND, MODEL, TYPE, LICENSE_PLATE, SEATS, COLOR, YEAR, PICTURE FROM car_models JOIN car ON car.MODEL_ID = car_models.ID WHERE car.USER_ID = ?", [data.id]);
          data.cars = []
          cars.result.forEach(item => {
            let obj = {
              modelId: item.MODEL_ID,
              carId: item.ID,
              brand: item.BRAND,
              model: item.MODEL,
              type: item.TYPE,
              licensePlate: item.LICENSE_PLATE,
              year: item.YEAR,
              seats: item.SEATS,
              color: carModels.allColors()[item.COLOR.split(':')[0]][item.COLOR.split(':')[1]] /* I apologize for not-clean-code, but this was the easiest way */
            }
            data.cars.push(obj)
            //console.log(obj)
          })

        }

        res.end(JSON.stringify(data))
      }
    },
    '/getCarModels': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        let result = await runQuery("SELECT BRAND, MODEL FROM car_models", []);
        let cars = result.result
        let carsObj = {}

        cars.forEach(item => {
          if (!carsObj[item.BRAND]) { // when brand not initialized, then do it
            carsObj[item.BRAND] = []
            // console.log('ARRAY AND OBJECT CREATED')
            // console.log(carsObj[item.BRAND])
          }
          if (carsObj[item.BRAND].indexOf(item.MODEL) == -1) { // models should not exist twice in array
            carsObj[item.BRAND].push(item.MODEL)
          }
          //console.log(carsObj[item.BRAND]
        })
        //console.log(carsObj)

        // structure of cars now should look like: {'Mercedes': ['C-Klasse', 'A-Klasse'], 'Audi': []}

        // console.log(carsObj)
        let colors = carModels.allColors()
        res.end(JSON.stringify({
          cars: carsObj,
          colors: colors
        }))
      }
    },
    '/getMessages': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId'], res)) {
        let allMessages = await runQuery("SELECT * FROM message WHERE ", [options.data]);
      }
    },
    '/getLegal': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        var fs = require('fs')
        fs.readFile('legal/small.txt', [], (err, data) => {
          if (err) {
            console.log(err)
            res.end(false)
          }
          console.log('success')
          res.end(data)
        })
      }
    },
  },
  'POST': {
    '/sqlTest': async (req, res, options) => {
      if (!isOptionMissing(options, ['data'], res)) {
        let result = await runQuery("INSERT INTO `test` (`ID`, `data`) VALUES (NULL, ?)", [options.data]);
        res.end(JSON.stringify(result))
      }
    },
    '/createUserIfNotExisting': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'name', 'mail'], res)) {
        let users = (await runQuery("SELECT ID FROM `users` WHERE users.FB_ID = ?", [options.secretFbId])).result[0];
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
            "INSERT INTO `users` (`ID`, `FB_ID`, `NAME`, `GENDER`, `COURSE`, `PICTURE`, `DESCRIPTION`, `CREATED_DATE`, `MAIL`, `PREF_SMOKING`, `PREF_MUSIC`, `PREF_TALK`, `PREF_TALK_MORNING`)" +
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
          "UPDATE `users` SET `DESCRIPTION` = ? WHERE `users`.`FB_ID` = ?",
          [options.description, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updateGender': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'gender'], res)) {
        await runQuery(
          "UPDATE `users` SET `GENDER` = ? WHERE `users`.`FB_ID` = ?",
          [options.gender, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updateLiftMaxDistance': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'liftMaxDistance'], res)) {
        await runQuery(
          "UPDATE `users` SET `LIFT_MAX_DISTANCE` = ? WHERE `users`.`FB_ID` = ?",
          [options.liftMaxDistance, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
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
          "UPDATE `users` SET `PICTURE` = ? WHERE `users`.`FB_ID` = ?",
          [blob, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updatePrefs': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'prefs'], res)) {
        await runQuery(
          "UPDATE users SET PREF_TALK = ?, PREF_TALK_MORNING = ?, PREF_SMOKING = ?, PREF_MUSIC = ? WHERE FB_ID = ?;",
          [options.prefs.talk, options.prefs.talkMorning, options.prefs.smoking, options.prefs.music, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/addAddress': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'adresses', 'id'], res)) {
        await runQuery(
          "INSERT INTO `address` (`ID`, `NICKNAME`, `POSTCODE`, `CITY`, `NUMBER`, `STREET`, `USER_INDEX`, `USER_ID`) VALUES (NULL, ?, ?, ?, ?, ?, '1', ?);",
          [options.address.nickname, options.address.postcode, options.address.city, options.address.number, options.address.street, options.id]).catch(error => {
            throw error;
          });
        // let result = await runQuery("SELECT ID FROM address WHERE USER_ID = ? ORDER BY ID DESC", [options.id])
        // result = result.result[0]

        res.end();
      }
    },
    '/removeAddress': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'id'], res)) {
        await runQuery(
          "DELETE FROM `adresses` WHERE `adresses`.`ID` = ?",
          [options.id]).catch(error => {
            throw error;
          });

        res.end();
      }
    },
    '/addCar': async (req, res, options) => {
      if (!isOptionMissing(options, ['data'], res)) {

        let car = options.data.car
        let id = options.data.id

        result = await runQuery("SELECT car_models.ID FROM car_models WHERE BRAND = ? AND MODEL = ?",
            [car.brand, car.model]).catch(error => {
              throw error
            })

        var modelId = result.result[0].ID


        await runQuery("INSERT INTO `car` (`ID`, `LICENSE_PLATE`, `SEATS`, `TYPE`, `COLOR`, `YEAR`, `MODEL_ID`, `USER_ID`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)",
          [car.licensePlate, car.seats, car.type, (car.colorTone + ':' + car.color), car.year, modelId, id]).catch(error => {
            throw error
          })

        res.end();
      }
    },
    '/removeCar': async (req, res, options) => {
      if (!isOptionMissing(options, ['id'], res)) {
        await runQuery(
          "DELETE FROM `car` WHERE `car`.`ID` = ?",
          [options.id]).catch(error => {
            throw error;
          })

        res.end();
      }
    },
    '/addLift': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'lift'], res)) {
        var lift = options.lift
        var userId = options.id

        await runQuery(
          "INSERT INTO `lift` (`CREATED_AT`, `OFFERED_SEATS`, `CAR_ID`, `DRIVER_ID`) VALUES (current_timestamp(), ?, ?, ?)",
          [lift.seats, lift.carId, userId]).catch(error => {
            throw error;
          })
        

        res.end();
      }
    }
  }
}