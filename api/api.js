var runQuery = require('./db'),
  showdown = require('showdown'),
  fs = require('fs'),
  readline = require('readline');
const { chatLifts } = require('./simulation/apiResponse');
const newsPath = 'news/postillon/ticker.txt',
  longQueries = require('./longQueries'),
  apiResponseSimulation = require('./simulation/apiResponse')

function isOptionMissing(data, needed, res) {
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

function generateJdenticon(seed) {
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
  return jdenticon.toPng(seed, size);
}

async function getChatLifts(uid) {
  //TODO make query return Nickname if the querying user is offering the lift. Maybe https://stackoverflow.com/questions/1747750/select-column-if-blank-select-from-another
  var lift_data = (await runQuery(`
SELECT lift.id, lift.UUID AS LIFT_ID, car_models.BRAND AS CAR_BRAND, car_models.MODEL AS CAR_MODEL, car.COLOR AS CAR_COLOR, car.SEATS AS CAR_SEATS, car.LICENSE_PLATE AS CAR_LICENSE_PLATE, car.YEAR AS CAR_BUILT, car.TYPE AS CAR_TYPE, lift.DEPART_AT as LIFT_DEPART, lift.ARRIVE_BY as LIFT_ARRIVE, destination.CITY as DESTINATION_CITY, start_point.CITY AS START_CITY, driver.FB_ID as DRIVER_ID, driver.NAME as DRIVER_NAME, driver.SURNAME as DRIVER_SURNAME, driver.PREF_TALK as DRIVER_PREF_TALK, driver.PREF_TALK_MORNING as DRIVER_PREF_TALKMORNING, driver.PREF_SMOKING AS DRIVER_PREF_SMOKING, driver.PREF_MUSIC as DRIVER_PREF_MUSIC, member_list.JSON_MEMBERS, GROUP_CONCAT( CONCAT('{type:', IF(ISNULL(messages.CONTENT),IF(ISNULL(messages.AUDIO),3,2),1), ', content:\'', IFNULL(messages.CONTENT, messages.UUID) , '\', timestamp: \'', messages.TIMESTAMP,'\', sentBy: \'', msg_user.FB_ID, '\}') SEPARATOR ', ') AS JSON_MESSAGES
FROM users
join lift_map on lift_map.USER_ID = users.ID
join lift on lift_map.LIFT_ID = lift.ID
join car on lift.CAR_ID = car.ID
join car_models on car.MODEL_ID = car_models.ID
JOIN adresses destination on lift.DESTINATION = destination.ID
join adresses start_point on lift.START = start_point.ID
join lift_map driver_map on lift_map.LIFT_ID = driver_map.LIFT_ID
join users driver on driver_map.USER_ID = driver.ID
left outer join (
    SELECT LIFT_ID, CONCAT( '[', GROUP_CONCAT(CONCAT('{name:', members.NAME, ',surname:', members.SURNAME, ',fbId:', members.FB_ID, '}') SEPARATOR ', ') , ']') AS JSON_MEMBERS
    from users members 
    join lift_map non_drivers on non_drivers.USER_ID = members.ID
    where non_drivers.IS_DRIVER = 0
    AND non_drivers.PENDING = 0
    GROUP by non_drivers.LIFT_ID ) member_list on member_list.LIFT_ID = lift_map.LIFT_ID
join messages on lift_map.LIFT_ID = messages.LIFT_ID
join users msg_user on messages.FROM_USER_ID = msg_user.ID

where 
driver_map.IS_DRIVER = 1 AND
AND lift_map.PENDING = 0
users.FB_ID = ?

group by lift_map.LIFT_ID
  `, [uid])).result[0]
  var chatLifts = {
    id: lift_data.LIFT_ID,
    car: {
      brand: lift_data.CAR_BRAND,
      model: lift_data.CAR_MODEL,
      color: lift_data.CAR_COLOR,
      allSeats: lift_data.CAR_SEATS,
      licensePlate: lift_data.CAR_LICENSE_PLATE,
      built: lift_data.CAR_BUILT,
      type: lift_data.CAR_TYPE
    },
    departAt: lift_data.LIFT_DEPART,
    arriveBy: lift_data.LIFT_ARRIVE,
    destination: lift_data.DESTINATION_CITY,
    start: lift_data.START_CITY,
    driver: {
      id: lift_data.DRIVER_ID,
      name: lift_data.DRIVER_NAME,
      surname: lift_data.DRIVER_SURNAME,
      prefs: {
        talk: lift_data.DRIVER_PREF_TALK,
        talkMorning: lift_data.DRIVER_PREF_TALKMONING,
        smoking: lift_data.DRIVER_PREF_SMOKING,
        music: lift_data.DRIVER_PREF_MUSIC
      }
    },
    passengers: JSON.parse(lift_data.JSON_MEMBERS),
    messages: JSON.parse(lift_data.JSON_MESSAGES)
  }
}

module.exports = {
  'GET': {
    '/ping': (req, res, options) => {
      console.log("HIII")
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
          news = news.filter(line => !line.includes('//') && line.length) // ignore all lines containing // and all empty lines

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
          uid = options.fbid
        if (!userData) {
          res.writeHead(204) // case when wrong fbId has been transmitted
          res.end()
          return
        }
        else {

          let data = {
            uid: uid,
            name: userData.NAME,
            gender: userData.GENDER,
            course: userData.COURSE,
            bio: userData.DESCRIPTION,
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
          if (options.secretFbId = options.fbid) { // NOT ACCESSING PUBLIC PROFILE
            data.settings = {
              liftMaxDistance: userData.LIFT_MAX_DISTANCE
            }
            var addresses = await runQuery("SELECT adresses.* FROM `adresses` LEFT JOIN users ON (users.ID = adresses.USER_ID) WHERE adresses.ID <= 3 OR adresses.USER_ID = 1", [uid]);
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

            data.chatLifts = getChatLifts(uid)

            const simulationProps = ['liftRequests', 'topFriends']

            simulationProps.forEach(prop => {
              data[prop] = apiResponseSimulation[prop]
            })
          }

          res.end(JSON.stringify(data))
        }
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
      if (!isOptionMissing(options, ['secretFbId'], res)) {
        res.end(getChatLifts(secretFbId))
      }
    },
    '/getLegal': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        var html = ''
        fs.readFile('legal/legal.md', 'utf8', (err, data) => {

          try {
            var converter = new showdown.Converter()

            html = converter.makeHtml(data)

          } catch (e) { }
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
    '/getTeamInfo': async (req, res, options) => {
      if (!isOptionMissing(options, [], res)) {
        const team = apiResponseSimulation.team,
          about = apiResponseSimulation.info

        var html = ''
        fs.readFile('legal/about.md', 'utf8', (err, data) => {

          try {
            var converter = new showdown.Converter()

            html = converter.makeHtml(data)
            about.text = html
          } catch (e) { }
        })
        var obj = {
          team: team,
          about: about
        }

        res.end(JSON.stringify(obj))
      }
    },
    '/chatPicture': async (req, res, options) => {
      if (!isOptionMissing(options, ['msgId', 'secretFbId'], res)) {
        let pic = (await runQuery(`
        SELECT messages.PICTURE from messages
        join lift_map on messages.LIFT_ID = lift_map.LIFT_ID
        join users.ID = lift_map.USER_ID
        where users.FB_ID = ?
        AND lift_map.PENDING = 0
        AND messages.UUID = ?`, [options.secretFbId, options.msgId])).result[0].PICTURE
        res.setHeader('Content-Type', 'image/jpg');
        res.end(pic, 'binary');
      }
    },
    '/chatAudio': async (req, res, options) => {
      if (!isOptionMissing(options, ['msgId', 'secretFbId'], res)) {
        let audio = (await runQuery(`
        SELECT messages.AUDIO from messages
        join lift_map on messages.LIFT_ID = lift_map.LIFT_ID
        join users.ID = lift_map.USER_ID
        where users.FB_ID = ?
        AND lift_map.PENDING = 0
        AND messages.UUID = ?`, [options.secretFbId, options.msgId])).result[0].AUDIO
        res.setHeader('Content-Type', 'application/octet-stream');
        res.end(audio, 'binary');
      }
    },
    '/marketplace': async (req, res, options) => {
      if (!isOptionMissing(options, ['msgId', 'secretFbId'], res)) {
        let db_lifts = (await runQuery(`
SELECT lift.UUID AS ID, driver.FB_ID as DRIVER_FB_ID, driver.NAME as DRIVER_NAME, driver.SURNAME as DRIVER_SURNAME, driver.PREF_TALK as DRIVER_PREF_TALK, driver.PREF_TALK_MORNING as DRIVER_PREF_TALKMORNING, driver.PREF_SMOKING AS DRIVER_PREF_SMOKING, driver.PREF_MUSIC as DRIVER_PREF_MUSIC, lift.DEPART_AT as LIFT_DEPART, lift.ARRIVE_BY as LIFT_ARRIVE, destination.CITY as DESTINATION_CITY, start_point.CITY AS START_CITY, lift.OFFERED_SEATS, IFNULL(counts.OCCUPIED_SEATS, 0) AS OCCUPIED_SEATS

FROM lift
join lift_map on lift_map.LIFT_ID = lift.ID
join users driver on lift_map.USER_ID = driver.ID AND lift_map.IS_DRIVER = 1
JOIN adresses destination on lift.DESTINATION = destination.ID
join adresses start_point on lift.START = start_point.ID
left outer join (SELECT lift_map.LIFT_ID, count(*) AS OCCUPIED_SEATS from lift_map where lift_map.PENDING != 0 GROUP BY lift_map.LIFT_ID) counts on lift.ID = counts.LIFT_ID

where lift.FIRST_DATE >= CURRENT_DATE() OR lift.REPEATS_ON_WEEKDAY != 0`, [])).result[0]

        var lifts = []
        db_lifts.forEach(lift => lifts.push({
          id: lift.ID,
          driver: {
            fbid: lift.DRIVER_FB_ID,
            name: lift.DRIVER_NAME,
            surname: lift.DRIVER_SURNAME,
            prefs: {
              talk: lift.DRIVER_PREF_TALK,
              talkMorning: lift.DRIVER_PREF_TALKMONING,
              smoking: lift.DRIVER_PREF_SMOKING,
              music: lift.DRIVER_PREF_MUSIC
            }
          },
          departAt: lift.LIFT_DEPART,
          arriveBy: lift.LIFT_ARRIVE,
          destination: lift.DESTINATION_CITY,
          start: lift.START_CITY,
          seatsOffered: lift.OFFERED_SEATS,
          seatsOccupied: lift.OCCUPIED_SEATS
        }))
        res.end(audio);
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
          let png = generateJdenticon(options.name);
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
        var img = Buffer.from(options.imageData.substr(22), 'base64');
        var dimensions = require('image-size')(img);
        if (!(dimensions.width == 300 && dimensions.height == 300)) {
          res.writeHead(400);
          res.end("Image must be 300x300");
        }
        await runQuery(
          "UPDATE `users` SET `PICTURE` = ? WHERE `users`.`FB_ID` = ?", [img, options.secretFbId]).catch(error => {
            throw error;
          });
        res.end()
      }
    },
    '/resetProfilePicture': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId'], res)) {
        var name = (await runQuery("SELECT NAME FROM `users` WHERE users.FB_ID = ?", [options.secretFbId])).result[0].NAME
        await runQuery(
          "UPDATE `users` SET `PICTURE` = ? WHERE `users`.`FB_ID` = ?", [generateJdenticon(name), options.secretFbId]).catch(error => {
            throw error;
          });
        res.end()
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
          "INSERT INTO `lift` (`CREATED_AT`, `OFFERED_SEATS`, `CAR_ID`, `START`, `DESTINATION`, `UUID`, `REPEATS_ON_WEEKDAY`, `FIRST_DATE`, `DEPART_AT`, `ARRIVE_BY`,) VALUES (current_timestamp(), ?, ?, ?, ?, UUID_SSHORT(), ?, ? ,?, ?)", [lift.seats, lift.carId, userId, lift.startAddressId, lift.destinationAddressId, lift.repeats ? lift.weekday : 0, lift.firstDate, lift.departAt, lift.arriveBy]).catch(error => {
            throw error;
          })
        let insertedResult = await runQuery(
          "SELECT MAX(ID) FROM `lift`", []).catch(error => {
            throw error;
          })
        let newLiftId = insertedResult.result[0]['MAX(ID)']
        await runQuery(
          "INSERT INTO `lift_map` (`LIFT_ID`, `USER_ID`, `IS_DRIVER`, `PENDING`) VALUES (?, ?, 1, 0)", [newLiftId, userId]).catch(error => {
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
            await runQuery("INSERT INTO `messages` (`UUID`, `CONTENT`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (MD5(NOW(6)), ?, ?, ?, current_timestamp())", [message.content, id, message.liftId]).catch(error => {
              throw error
            })
            break
          case 2: // audio blob
            var blob = await (await fetch(dataURI)).blob();
            await runQuery("INSERT INTO `messages` (`UUID`, `AUDIO`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (MD5(NOW(6)), ?, ?, ?, current_timestamp())", [blob, id, message.liftId]).catch(error => {
              throw error
            })
            break
          case 3: // image blob
            var blob = await (await fetch(dataURI)).blob();
            await runQuery("INSERT INTO `messages` (`UUID`, `PICTURE`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (MD5(NOW(6)), ?, ?, ?, current_timestamp())", [message.content, id, message.liftId]).catch(error => {
              throw error
            })
            break
        }

        let result = await runQuery("SELECT MAX(ID) FROM `messages`", []).catch(error => {
          throw error
        })
        var id = result.result[0]['MAX(ID)'] + ''
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