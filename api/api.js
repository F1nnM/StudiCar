var runQuery = require('./db'),
  showdown = require('showdown'),
  fs = require('fs'),
  readline = require('readline')
const newsPath = 'news/postillon/ticker.txt',
  longQueries = require('./longQueries')

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
    '/getNewsticker': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        fs.readFile(newsPath, 'utf8', (err, data) => {
          if (err) throw err;
          var news = data.toString().split("\n");

          var rnd = Math.floor(Math.random() * news.length)
          news = news[rnd].split('+++')[1].trim()

          res.end(news)
        })
      }
    },
    '/getUserData': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid', 'secretFbId'], res)) {
        var userData = (await runQuery("SELECT ID, NAME, GENDER, COURSE, DESCRIPTION, CREATED_DATE, LIFTS_OFFERED, LIFTS_ALL, PREF_SMOKING, PREF_MUSIC, PREF_TALK, PREF_TALK_MORNING, LIFT_MAX_DISTANCE FROM `users` WHERE users.FB_ID = ?", [options.fbid])).result[0],
          liftCount = (await runQuery("SELECT COUNT(`LIFT_ID`) AS LIFT_COUNT FROM `lift_map` WHERE `USER_ID` = ? ", [options.fbid])).result[0].LIFT_COUNT,
          driverCount = (await runQuery("SELECT COUNT(`LIFT_ID`) AS DRIVER_COUNT FROM `lift_map` WHERE `IS_DRIVER` = true AND `USER_ID` = ? ", [options.fbid])).result[0].DRIVER_COUNT,
          uid = userData.ID

        let data = {
          id: userData.ID,
          uid: options.fbid,
          name: userData.NAME,
          gender: userData.GENDER,
          course: userData.COURSE,
          description: userData.DESCRIPTION,
          stats: {
            createdAt: userData.CREATED_DATE,
            liftCount: liftCount,
            driverCount: driverCount,
            liftsOffered: userData.LIFTS_OFFERED,
            liftsAll: userData.LIFTS_ALL,
          },
          prefs: {
            smoking: userData.PREF_SMOKING,
            music: userData.PREF_MUSIC,
            talk: userData.PREF_TALK,
            talkMorning: userData.PREF_TALK_MORNING
          }
        }
        if (options.secretFbId = options.fbid) {
          data.settings = {
            liftMaxDistance: userData.LIFT_MAX_DISTANCE
          }
          var addresses = await runQuery("SELECT adresses.* FROM adresses INNER JOIN users ON adresses.USER_ID = users.ID WHERE users.ID = ? AND adresses.ID > 3", [uid]);
          data.addresses = []

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
          var cars = await runQuery("SELECT car.*, car_models.BRAND, car_models.MODEL FROM car_models JOIN car ON car.MODEL_ID = car_models.ID WHERE car.USER_ID = ?", [uid]);
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
              color: '#' + item.COLOR
            }
            data.cars.push(obj)
          })
          let allMessages = await runQuery(longQueries.getMessages, [uid])
          var liftMessages = {}
          allMessages.result.forEach(item => {
            if (!liftMessages[item.LIFT_ID]) {
              liftMessages[item.LIFT_ID] = [] // making object if not existing
            }
            var content = '',
              type = 0
            if (item.AUDIO) {
              content = item.AUDIO
              type = 2
            } else if (item.PICTURE) {
              content = item.PICTURE
              type = 3
            } else {
              content = item.CONTENT
              type = 1
            }
            let obj = {
              messageID: item.ID,
              nameOfUser: item.NAME.split(' ')[0], // we take just the first name, looks more friendly in chat
              userId: item.FROM_USER_ID,
              content: content,
              type: type, // for docs see above
              liftId: item.LIFT_ID,
              start: item.START_NICK,
              destination: item.DEST_NICK,
              timestamp: item.TIMESTAMP
            }
            liftMessages[item.LIFT_ID].push(obj)
          })
          data.messages = liftMessages
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
          }
          if (carsObj[item.BRAND].indexOf(item.MODEL) == -1) { // models should not exist twice in array
            carsObj[item.BRAND].push(item.MODEL)
          } // basically grouped all cars in object array
        })

        res.end(JSON.stringify(carsObj))
      }
    },
    '/getMessages': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid'], res)) {
        let id = options.id
        let allMessages = await runQuery("SELECT * FROM lift_map JOIN messages ON lift_map.LIFT_ID = messages.LIFT_ID WHERE USER_ID = ? AND PENDING = 0", [id])
        res.end(JSON.stringify(allMessages))
      }
    },
    '/getLegal': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        var html = ''
        fs.readFile('legal/legal.md', 'utf8', (err, data) => {
          if (err) {
            // error
          } else {
            // console.log('success')
            try {
              var converter = new showdown.Converter()
              // console.log('data:')
              // console.log(data)
              html = converter.makeHtml(data)
              // console.log('html:')
              // console.log(html)
            } catch (e) {
              // convertion error
            }
          }
          res.end(html)
        })
      }
    },
    '/getLiftInfo': async (req, res, options) => {
      if (!isOptionMissing(options, ['id'], res)) {
        var liftId = options.id
        let carInfo = await runQuery("SELECT car_models.BRAND, car_models.MODEL, car.COLOR, car.TYPE, car.LICENSE_PLATE, lift.OFFERED_SEATS FROM lift JOIN car ON lift.CAR_ID = car.ID JOIN car_models ON car_models.ID = car.MODEL_ID WHERE lift.ID = ?;", [liftId])
        carInfo = carInfo.result[0]
        var car = {
          brand: carInfo.BRAND,
          model: carInfo.MODEL,
          color: carModels.allColors()[carInfo.COLOR.split(':')[0]][carInfo.COLOR.split(':')[1]],
          type: carInfo.TYPE,
          licensePlate: carInfo.LICENSE_PLATE,
        }
        let usersInfo = await runQuery("SELECT users.ID, users.NAME, users.PREF_TALK, users.PREF_TALK_MORNING, users.PREF_SMOKING, users.PREF_MUSIC FROM users JOIN lift_map ON lift_map.USER_ID = users.ID WHERE lift_map.PENDING = 0 AND lift_map.IS_DRIVER = 0 AND lift_map.LIFT_ID = ?", [liftId])
        usersInfo = usersInfo.result
        var passengers = []
        usersInfo.forEach(item => {
          passengers.push({
            userId: item.ID,
            nameOfUser: item.NAME.split(' ')[0], // as always only take the first name
            talk: item.PREF_TALK,
            talkMorning: item.PREF_TALK_MORNING,
            smoking: item.PREF_SMOKING,
            music: item.PREF_MUSIC
          })
        })

        res.end(JSON.stringify({
          car: car,
          passengers: passengers,
          seats: carInfo.OFFERED_SEATS
        }))
      }
    },
    '/getFAQ': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        var result = (await runQuery(longQueries.getFAQ, [])).result,
          data = []
        result.forEach(item => {
          data.push({
            id: item.ID,
            question: item.QUESTION,
            answer: item.ANSWER,
            category: item.CATEGORY,
            answeredBy: {
              id: item.ORGA_ID,
              name: item.ORGAS_NAME.split(' ')[0],
              function: item.FUNCTION
            }
          })
        })
        res.end(JSON.stringify(data))
      }
    },
    '/getAllFAQ': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        var result = (await runQuery(longQueries.getAllFAQ, [])).result,
          obj = {
            'bedienung': [],
            'sonstiges': []
          }
        result.forEach(item => {
          obj[item.CATEGORY.toLowerCase()].push({
            id: item.ID,
            question: item.QUESTION,
            askedBy: item.FIRST_NAME,
            answer: item.ANSWER,
            answeredBy: item.ORGAS_NAME.split(' ')[0],
            isPublic: item.IS_PUBLIC,
            lastChange: item.LAST_CHANGE
          })
        })

        res.end(JSON.stringify(obj))
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
            "VALUES (NULL, ?, ?, 'X', '', ?, '', NULL, ?, 'RED', 'RED', 'RED', 'RED')", [options.secretFbId, options.name, png, options.mail]).catch(error => {
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
          "UPDATE `users` SET `DESCRIPTION` = ? WHERE `users`.`FB_ID` = ?", [options.description, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updateGender': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'gender'], res)) {
        await runQuery(
          "UPDATE `users` SET `GENDER` = ? WHERE `users`.`FB_ID` = ?", [options.gender, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updateLiftMaxDistance': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'liftMaxDistance'], res)) {
        await runQuery(
          "UPDATE `users` SET `LIFT_MAX_DISTANCE` = ? WHERE `users`.`FB_ID` = ?", [options.liftMaxDistance, options.secretFbId]).catch(error => {
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
          "UPDATE `users` SET `PICTURE` = ? WHERE `users`.`FB_ID` = ?", [blob, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/updatePrefs': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'prefs'], res)) {
        await runQuery(
          "UPDATE users SET PREF_TALK = ?, PREF_TALK_MORNING = ?, PREF_SMOKING = ?, PREF_MUSIC = ? WHERE FB_ID = ?;", [options.prefs.talk, options.prefs.talkMorning, options.prefs.smoking, options.prefs.music, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end();
      }
    },
    '/addAddress': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'adresses', 'id'], res)) {
        await runQuery(
          "INSERT INTO `address` (`ID`, `NICKNAME`, `POSTCODE`, `CITY`, `NUMBER`, `STREET`, `USER_INDEX`, `USER_ID`) VALUES (NULL, ?, ?, ?, ?, ?, '1', ?);", [options.address.nickname, options.address.postcode, options.address.city, options.address.number, options.address.street, options.id]).catch(error => {
            throw error;
          });

        res.end();
      }
    },
    '/removeAddress': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'id'], res)) {
        await runQuery(
          "DELETE FROM `adresses` WHERE `adresses`.`ID` = ?", [options.id]).catch(error => {
            throw error;
          });

        res.end();
      }
    },
    '/addCar': async (req, res, options) => {
      if (!isOptionMissing(options, ['data'], res)) {

        let car = options.data.car
        let id = options.data.id

        result = await runQuery("SELECT car_models.ID FROM car_models WHERE BRAND = ? AND MODEL = ?", [car.brand, car.model]).catch(error => {
          throw error
        })

        var modelId = result.result[0].ID

        await runQuery("INSERT INTO `car` (`ID`, `LICENSE_PLATE`, `SEATS`, `TYPE`, `COLOR`, `YEAR`, `MODEL_ID`, `USER_ID`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)",
          [car.licensePlate, car.seats, car.type, car.color.replace('#', ''), car.year, modelId, id]).catch(error => {
            throw error
          })

        res.end();
      }
    },
    '/removeCar': async (req, res, options) => {
      if (!isOptionMissing(options, ['id'], res)) {
        await runQuery(
          "DELETE FROM `car` WHERE `car`.`ID` = ?", [options.id]).catch(error => {
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
          "INSERT INTO `lift` (`CREATED_AT`, `OFFERED_SEATS`, `CAR_ID`, `DRIVER_ID`, `START`, `DESTINATION`) VALUES (current_timestamp(), ?, ?, ?, ?, ?)", [lift.seats, lift.carId, userId, lift.startAddressId, lift.destinationAddressId]).catch(error => {
            throw error;
          })
        let insertedResult = await runQuery(
          "SELECT MAX(ID) FROM `lift`", []).catch(error => {
            throw error;
          })
        let newLiftId = insertedResult.result[0]['MAX(ID)']
        await runQuery(
          "INSERT INTO `lift_map` VALUES (?, ?, 1, 1)", [newLiftId, userId]).catch(error => {
            throw error;
          })


        res.end();
      }
    },
    '/sendMessage': async (req, res, options) => {
      if (!isOptionMissing(options, ['id', 'message'], res)) {
        var message = options.message
        var id = options.id
        switch (message.type) {
          case 1: // text
            await runQuery("INSERT INTO `messages` (`CONTENT`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (?, ?, ?, current_timestamp())", [message.content, id, message.liftId]).catch(error => {
              throw error
            })
            break
          case 2: // audio blob
            var blob = await (await fetch(dataURI)).blob();
            await runQuery("INSERT INTO `messages` (`AUDIO`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (?, ?, ?, current_timestamp())", [blob, id, message.liftId]).catch(error => {
              throw error
            })
            break
          case 3: // image blob
            var blob = await (await fetch(dataURI)).blob();
            await runQuery("INSERT INTO `messages` (`PICTURE`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (?, ?, ?, current_timestamp())", [message.content, id, message.liftId]).catch(error => {
              throw error
            })
            break
        }

        function dataURItoBlob (dataURI) {
          // convert base64 to raw binary data held in a string
          // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
          var byteString = atob(dataURI.split(',')[1]);

          // separate out the mime component
          var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

          // write the bytes of the string to an ArrayBuffer
          var ab = new ArrayBuffer(byteString.length);

          // create a view into the buffer
          var ia = new Uint8Array(ab);

          // set the bytes of the buffer to the correct values
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          // write the ArrayBuffer to a blob, and you're done
          var blob = new Blob([ab], { type: mimeString });
          return blob;

        }
        let result = await runQuery("SELECT MAX(ID) FROM `messages`", []).catch(error => {
          throw error
        })
        var id = result.result[0]['MAX(ID)'] + ''
        console.log(typeof id)
        res.end(id)
      }
    },
    '/addQuestion': async (req, res, options) => {
      if (!isOptionMissing(options, ['question', 'category', 'uid'], res)) {
        var cat = options.category

        await runQuery("INSERT INTO `faq` (`QUESTION`, `CATEGORY`, `ASKED_BY`) VALUES (?, ?, ?)", [options.question, cat, uid])
        res.end()
      }
    },
    '/updateQuestion': async (req, res, options) => {
      if (!isOptionMissing(options, ['data', 'mode'], res)) {
        var d = options.data
        if (options.mode == 1) { // normal mode
          await runQuery("UPDATE faq SET ANSWER = ?, ANSWERED_BY = ?, IS_PUBLIC = ? WHERE ID = ?;", [d.answer, d.orgaId, d.instantPublish, d.id])
        } else { // mode is 2, special mode just to set publicity
          await runQuery("UPDATE faq SET IS_PUBLIC = ? WHERE ID = ?;", [d.newValue, d.id])
        }

        res.end()
      }
    },
  }
}