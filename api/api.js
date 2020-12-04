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
  WITH
	lifts as (
        SELECT
          lift.id,
          lift.UUID AS LIFT_ID,
          car_models.BRAND AS CAR_BRAND,
          car_models.MODEL AS CAR_MODEL,
          car.COLOR AS CAR_COLOR,
          car.SEATS AS CAR_SEATS,
          car.LICENSE_PLATE AS CAR_LICENSE_PLATE,
          car.YEAR AS CAR_BUILT,
          car.TYPE AS CAR_TYPE,
          lift.DEPART_AT AS LIFT_DEPART,
          lift.ARRIVE_BY AS LIFT_ARRIVE,
          destination.CITY AS DESTINATION_CITY,
          start_point.CITY AS START_CITY,
          driver.FB_ID AS DRIVER_ID,
          driver.NAME AS DRIVER_NAME,
          driver.SURNAME AS DRIVER_SURNAME,
          driver.PREF_TALK AS DRIVER_PREF_TALK,
          driver.PREF_TALK_MORNING AS DRIVER_PREF_TALKMORNING,
          driver.PREF_SMOKING AS DRIVER_PREF_SMOKING,
          driver.PREF_MUSIC AS DRIVER_PREF_MUSIC,
          member_list.JSON_MEMBERS,
          JSON_ARRAYAGG(
              JSON_OBJECT('type',
                  IF(
                      ISNULL(messages.CONTENT),
                      IF(ISNULL(messages.AUDIO),
                      3,
                      2),
                      1
                  ),
                  'content',
                  IFNULL(
                      messages.CONTENT,
                      messages.UUID
                  ),
                  'timestamp',
                  messages.TIMESTAMP,
                  'sentBy',
                  msg_user.FB_ID
              )
          ) AS JSON_MESSAGES
        FROM
          users 
          JOIN
              lift_map 
              ON lift_map.USER_ID = users.ID 
          JOIN
              lift 
              ON lift_map.LIFT_ID = lift.ID 
          JOIN
              car 
              ON lift.CAR_ID = car.ID 
          JOIN
              car_models 
              ON car.MODEL_ID = car_models.ID 
          JOIN
              addresses destination 
              ON lift.DESTINATION = destination.ID 
          JOIN
              addresses start_point 
              ON lift.START = start_point.ID 
          JOIN
              lift_map driver_map 
              ON lift_map.LIFT_ID = driver_map.LIFT_ID 
          JOIN
              users driver 
              ON driver_map.USER_ID = driver.ID 
          LEFT OUTER JOIN(
                  SELECT
                      LIFT_ID,
                      JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'name',
                              members.NAME,
                              'surname',
                              members.SURNAME,
                              'fbId',
                              members.FB_ID
                          )
                      ) AS JSON_MEMBERS
                  FROM
                      users members 
                      JOIN
                          lift_map non_drivers 
                          ON non_drivers.USER_ID = members.ID 
                  WHERE
                      non_drivers.IS_DRIVER = 0 
                      AND non_drivers.PENDING = 0 
                  GROUP BY
                      non_drivers.LIFT_ID 
              )
              member_list 
              ON member_list.LIFT_ID = lift_map.LIFT_ID 
          JOIN
              messages 
              ON lift_map.LIFT_ID = messages.LIFT_ID 
          JOIN
              users msg_user 
              ON messages.FROM_USER_ID = msg_user.ID 
        WHERE
          driver_map.IS_DRIVER = 1 
          AND lift_map.PENDING = 0
          AND users.FB_ID = ?
        GROUP BY
          lift_map.LIFT_ID
    )
SELECT 
	IFNULL(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', LIFT_ID,
                'car', JSON_OBJECT(
                    'brand', CAR_BRAND,
                    'model', CAR_MODEL,
                    'allSeats', CAR_SEATS,
                    'licensePlate', CAR_LICENSE_PLATE,
                    'built', CAR_BUILT,
                    'type', CAR_TYPE
                ),
                'departAt', LIFT_DEPART,
                'arriveBy', LIFT_ARRIVE,
                'destination', DESTINATION_CITY,
                'start', START_CITY,
                'driver', JSON_OBJECT(
                    'id', DRIVER_ID,
                    'name', DRIVER_NAME,
                    'surname', DRIVER_SURNAME,
                    'prefs', JSON_OBJECT(
                        'talk', DRIVER_PREF_TALK,
                        'talkMorning', DRIVER_PREF_TALKMORNING,
                        'smoking', DRIVER_PREF_SMOKING,
                        'music', DRIVER_PREF_MUSIC
                    )
                ),
                'passengers', JSON_QUERY(JSON_MEMBERS, '$'),
                'messages', JSON_QUERY(JSON_MESSAGES, '$')
            )
        ),
        JSON_ARRAY()
    )
    AS JSON
FROM lifts

  `, [uid])).result[0].JSON
  return lift_data
}

async function getLiftRequests(uid) {
  var db_requests = (await runQuery(`
  SELECT
  IFNULL(
      JSON_ARRAYAGG(lifts.DATA),
      JSON_ARRAY()
  ) AS JSON 
FROM
  (
      SELECT
          JSON_OBJECT(
              'liftId',
              my_lifts.LIFT_ID,
              'requestingUsers',
              JSON_ARRAY(
                  JSON_OBJECT(
                      'fbId',
                      users.FB_ID,
                      'name',
                      users.NAME,
                      'surname',
                      users.SURNAME,
                      'bio',
                      users.DESCRIPTION,
                      'stats',
                      JSON_OBJECT(
                          'liftCount',
                          IFNULL(liftCount.COUNT, 0),
                          'driverCount',
                          IFNULL(driverCount.COUNT, 0)
                      ),
                      'prefs',
                      JSON_OBJECT(
                          'talk',
                          users.PREF_TALK,
                          'talkMorning',
                          users.PREF_TALK_MORNING,
                          'smoking',
                          users.PREF_SMOKING,
                          'music',
                          users.PREF_MUSIC
                      )
                  )
              )
          ) AS DATA 
      FROM
          users me 
          JOIN
              lift_map my_lifts 
              ON my_lifts.USER_ID = me.ID 
              AND my_lifts.IS_DRIVER = 1 
          JOIN
              lift_map requests 
              ON my_lifts.LIFT_ID = requests.LIFT_ID 
              AND requests.PENDING = 1 
          JOIN
              users 
              ON requests.USER_ID = users.ID 
          LEFT OUTER JOIN
              (
                  SELECT
                      lift_map.USER_ID,
                      COUNT(*) AS COUNT 
                  FROM
                      lift_map 
                  WHERE
                      lift_map.IS_DRIVER = 0 
                      AND lift_map.PENDING = 0 
                  GROUP BY
                      lift_map.USER_ID
              )
              liftCount 
              ON users.ID = liftCount. USER_ID 
          LEFT OUTER JOIN
              (
                  SELECT
                      lift_map.USER_ID,
                      COUNT(*) AS COUNT 
                  FROM
                      lift_map 
                  WHERE
                      lift_map.IS_DRIVER = 1 
                  GROUP BY
                      lift_map.USER_ID
              )
              driverCount 
              ON users.ID = driverCount.USER_ID
      WHERE me.FB_ID = ?
      GROUP BY
          my_lifts.LIFT_ID 
  )
  lifts
  `, [uid])).result[0].JSON

  return db_requests;
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
          news = news.filter(line => !line.includes('//') && line.length) // ignore all lines containing // and all empty lines

          var rnd = Math.floor(Math.random() * news.length)
          const ticker = news[rnd].split('+++')[1].trim()

          res.end(JSON.stringify({
            ticker: ticker
          }))
        })
      }
    },
    '/getUserData': async (req, res, options) => {
      if (!isOptionMissing(options, ['fbid', 'secretFbId'], res)) {
        var data;
        if (options.secretFbId = options.fbid) { // NOT ACCESSING PUBLIC PROFILE
          data = (await runQuery(`
          SELECT
              users.ID INTO @userid 
          FROM
              users 
          WHERE
              users.FB_ID = ?;
          WITH data AS 
          (
              SELECT
                  users.ID AS USER_ID,
                  users.FB_ID,
                  users.NAME,
                  users.GENDER,
                  users.COURSE,
                  users.DESCRIPTION,
                  users.CREATED_DATE,
                  users.PREF_SMOKING,
                  users.PREF_MUSIC,
                  users.PREF_TALK,
                  users.PREF_TALK_MORNING,
                  users.LIFT_MAX_DISTANCE 
              FROM
                  users 
              WHERE
                  users.ID = @userid 
          )
          ,
          drives AS 
          (
              SELECT
                  lift_map.USER_ID,
                  COUNT(lift_map.LIFT_ID) AS COUNT 
              FROM
                  lift_map 
              WHERE
                  lift_map.IS_DRIVER = 1 
                  AND lift_map.USER_ID = @userid 
          )
          ,
          rides AS 
          (
              SELECT
                  lift_map.USER_ID,
                  COUNT(lift_map.LIFT_ID) AS COUNT 
              FROM
                  lift_map 
              WHERE
                  lift_map.PENDING = 0 
                  AND lift_map.IS_DRIVER = 0 
                  AND lift_map.USER_ID = @userid 
          )
          ,
          user_addresses AS 
          (
            SELECT
                addresses.ID, #TODO has to be removed
                addresses.NICKNAME,
                addresses.POSTCODE,
                addresses.CITY,
                addresses.NUMBER,
                addresses.STREET,
                addresses.USER_ID
              FROM
                addresses
              WHERE
                addresses.ID <= 3
                OR addresses.USER_ID = @userid
          )
          ,
          cars AS
          (
            SELECT
                car.USER_ID,
                car.ID, #TODO remove?
                  car.LICENSE_PLATE,
                  car.TYPE,
                  car.SEATS,
                  car.COLOR,
                  car.YEAR,
                car.MODEL_ID,
                car_models.BRAND,
                car_models.MODEL
              FROM
                car
              JOIN
                car_models
                ON car.MODEL_ID = car_models.ID
              WHERE
                car.USER_ID = @userid
          )
          
          SELECT
            JSON_INSERT(
                  JSON_OBJECT(
                      'uid', data.FB_ID,
                      'name', data.NAME,
                      'gender', data.GENDER,
                      'bio', data.DESCRIPTION,
                      'stats', JSON_OBJECT(
                          'createdAt', data.CREATED_DATE,
                          'liftCount', IFNULL(rides.COUNT, 0),
                          'driverCount', IFNULL(drives.COUNT,0)
                      ),
                      'prefs', JSON_OBJECT(
                          'smoking', data.PREF_SMOKING,
                          'music', data.PREF_MUSIC,
                          'talk', data.PREF_TALK,
                          'talkMorning', data.PREF_TALK_MORNING
                      ),
                      'settings', JSON_OBJECT(
                          'liftMaxDistance', data.LIFT_MAX_DISTANCE
                      )
                  ),
                  '$.addresses',
                  JSON_ARRAYAGG(
                      JSON_OBJECT(
                          'id', user_addresses.ID,
                          'nickname', user_addresses.NICKNAME,
                          'postcode', user_addresses.POSTCODE,
                          'city', user_addresses.CITY,
                          'street', user_addresses.STREET,
                          'number', user_addresses.NUMBER
                      )
                  ),
                  '$.cars',
                  JSON_ARRAYAGG(
                      JSON_OBJECT(
                          'modelId', cars.MODEL_ID,
                          'carId', cars.ID,
                          'brand', cars.BRAND,
                          'model', cars.MODEL,
                          'type', cars.TYPE,
                          'licensePlate', cars.LICENSE_PLATE,
                          'year', cars.YEAR,
                          'seats', cars.SEATS,
                          'color', CONCAT( '#', cars.COLOR)
                      )
                  )
              ) AS JSON
          FROM
              data 
              LEFT OUTER JOIN
                  rides USING(USER_ID) 
              LEFT OUTER JOIN
                  drives USING(USER_ID)
              LEFT OUTER JOIN
                  user_addresses USING(USER_ID)
              LEFT OUTER JOIN
                cars USING(USER_ID)
            `, [options.fbid])).result[1][0].JSON

          data = JSON.parse(data)

          data.chatLifts = JSON.parse(await getChatLifts(options.fbid))
          data.liftRequests = JSON.parse(await getLiftRequests(options.fbid))

          data['topFriends'] = apiResponseSimulation['topFriends']

        } else {
          data = JSON.parse((await runQuery(`
          SELECT
              users.ID INTO @userid 
          FROM
              users 
          WHERE
              users.FB_ID = ?;
          WITH data AS 
          (
              SELECT
                  users.ID AS USER_ID,
                  users.FB_ID,
                  users.NAME,
                  users.GENDER,
                  users.COURSE,
                  users.DESCRIPTION,
                  users.CREATED_DATE,
                  users.PREF_SMOKING,
                  users.PREF_MUSIC,
                  users.PREF_TALK,
                  users.PREF_TALK_MORNING
              FROM
                  users 
              WHERE
                  users.ID = @userid 
          )
          ,
          drives AS 
          (
              SELECT
                  lift_map.USER_ID,
                  COUNT(lift_map.LIFT_ID) AS COUNT 
              FROM
                  lift_map 
              WHERE
                  lift_map.IS_DRIVER = 1 
                  AND lift_map.USER_ID = @userid 
          )
          ,
          rides AS 
          (
              SELECT
                  lift_map.USER_ID,
                  COUNT(lift_map.LIFT_ID) AS COUNT 
              FROM
                  lift_map 
              WHERE
                  lift_map.PENDING = 0 
                  AND lift_map.IS_DRIVER = 0 
                  AND lift_map.USER_ID = @userid 
          )
          SELECT
              JSON_OBJECT(
                  'uid', data.FB_ID,
                  'name', data.NAME,
                  'gender', data.GENDER,
                  'bio', data.DESCRIPTION,
                  'stats', JSON_OBJECT(
                      'createdAt', data.CREATED_DATE,
                      'liftCount', IFNULL(rides.COUNT, 0),
                      'driverCount', IFNULL(drives.COUNT,0)
                  ),
                  'prefs', JSON_OBJECT(
                      'smoking', data.PREF_SMOKING,
                      'music', data.PREF_MUSIC,
                      'talk', data.PREF_TALK,
                      'talkMorning', data.PREF_TALK_MORNING
                  )
              ) AS JSON
          FROM
              data 
              LEFT OUTER JOIN
                  rides USING(USER_ID) 
              LEFT OUTER JOIN
                  drives USING(USER_ID)
            `, [options.fbid])).result[1][0].JSON)
        }


        data.stats.liftsOffered = Math.floor(Math.random() * 100)
        data.stats.liftsAll = data.stats.liftsOffered + Math.floor(Math.random() * 200)

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
      let db_lifts = (await runQuery(`
SELECT lift.UUID AS ID, driver.FB_ID as DRIVER_FB_ID, driver.NAME as DRIVER_NAME, driver.SURNAME as DRIVER_SURNAME, driver.PREF_TALK as DRIVER_PREF_TALK, driver.PREF_TALK_MORNING as DRIVER_PREF_TALKMORNING, driver.PREF_SMOKING AS DRIVER_PREF_SMOKING, driver.PREF_MUSIC as DRIVER_PREF_MUSIC, lift.DEPART_AT as LIFT_DEPART, lift.ARRIVE_BY as LIFT_ARRIVE, destination.CITY as DESTINATION_CITY, start_point.CITY AS START_CITY, lift.OFFERED_SEATS, IFNULL(counts.OCCUPIED_SEATS, 0) AS OCCUPIED_SEATS

FROM lift
join lift_map on lift_map.LIFT_ID = lift.ID
join users driver on lift_map.USER_ID = driver.ID AND lift_map.IS_DRIVER = 1
JOIN addresses destination on lift.DESTINATION = destination.ID
join addresses start_point on lift.START = start_point.ID
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
    },
    '/liftRequests': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId'], res)) {
        res.end((await getLiftRequests(secretFbId)));
      }
    }
  },
  'POST': {
    '/createUserIfNotExisting': async (req, res, options) => {
      if (!isOptionMissing(options, ['secretFbId', 'name', 'surname', 'mail'], res)) {
        let users = (await runQuery("SELECT ID FROM `users` WHERE users.FB_ID = ?", [options.secretFbId])).result[0];
        if (!users) {
          let png = generateJdenticon(options.name);
          await runQuery(
            "INSERT INTO `users` (`ID`, `FB_ID`, `NAME`, `SURNAME`, `GENDER`, `COURSE`, `PICTURE`, `DESCRIPTION`, `CREATED_DATE`, `MAIL`, `PREF_SMOKING`, `PREF_MUSIC`, `PREF_TALK`, `PREF_TALK_MORNING`)" +
            "VALUES (NULL, ?, ?, ?, 'X', '', ?, '', NULL, ?, 'RED', 'RED', 'RED', 'RED')", [options.secretFbId, options.name, options.surname, png, options.mail]).catch(error => {
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
      if (!isOptionMissing(options, ['secretFbId', 'address', 'id'], res)) {
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
          "DELETE FROM `addresses` WHERE `addresses`.`ID` = ?", [options.id]).catch(error => {
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