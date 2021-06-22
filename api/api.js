const runQuery = require("./db"),
  fs = require("fs"),
  fetch = require("node-fetch"),
  /* longQueries           = require('./longQueries'), */
  apiResponseSimulation = require("./simulation/apiResponse"),
  tickerJS = require("./news/postillon/ticker.js"),
  errorHandler = require("./errorHandler");
const { database } = require("./errorHandler");

function isOptionMissing(data, needed, res) {
  return needed.some((key) => {
    if (typeof data[key] == "undefined") {
      res.writeHead(400);
      res.end("No field '" + key + "' supplied!");
      console.log('Error occurred: missing property "' + key + '" at ' + data);
      return true;
    }
    return false;
  });
}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

// queries for quick, not-optimized database access

async function getUserId(fbId) {
  let result = (await runQuery("SELECT ID FROM users WHERE FB_ID = ?", [fbId]))
    .result[0];
  return result ? result.ID : null;
}

async function getLiftId(liftUuid) {
  return (await runQuery("SELECT ID FROM lift WHERE UUID = ?", [liftUuid]))
    .result[0].ID;
}

// end of those queries

function generateJdenticon(seed) {
  var jdenticon = require("jdenticon");
  jdenticon.config = {
    lightness: {
      color: [0.31, 0.81],
      grayscale: [0.26, 0.9],
    },
    saturation: {
      color: 0.6,
      grayscale: 0.0,
    },
    backColor: "#ffffffff",
  };

  let size = 300;
  return jdenticon.toPng(seed, size);
}

async function getChatLifts(uid) {
  // TODO make query return Nickname if the querying user is offering the lift. Maybe https://stackoverflow.com/questions/1747750/select-column-if-blank-select-from-another
  var lift_data = (
    await runQuery(
      `
  WITH
	lifts as (
        SELECT
          lift.id,
          lift.UUID AS LIFT_ID,
          car_models.BRAND AS CAR_BRAND,
          car_models.MODEL AS CAR_MODEL,
          lift.OFFERED_SEATS AS CAR_SEATS,
          car.LICENSE_PLATE AS CAR_LICENSE_PLATE,
          car.YEAR AS CAR_BUILT,
          car.TYPE AS CAR_TYPE,
          car.COLOR AS CAR_COLOR,
          lift.DEPART_AT AS LIFT_DEPART,
          lift.ARRIVE_BY AS LIFT_ARRIVE,
          destination.CITY AS DESTINATION_CITY,
      	  (IF(destination.ID <= 3, destination.ID, -1)) AS DESTINATION_ID,
          start_point.CITY AS START_CITY,
      	  (IF(start_point.ID <= 3, start_point.ID, -1)) AS START_ID,
          driver.FB_ID AS DRIVER_ID,
          driver.NAME AS DRIVER_NAME,
          driver.SURNAME AS DRIVER_SURNAME,
          driver.PREF_TALK AS DRIVER_PREF_TALK,
          driver.PREF_TALK_MORNING AS DRIVER_PREF_TALKMORNING,
          driver.PREF_SMOKING AS DRIVER_PREF_SMOKING,
          driver.PREF_MUSIC AS DRIVER_PREF_MUSIC,
          member_list.JSON_MEMBERS,
      	  lift.REPEATS_ON_WEEKDAY AS REPEAT_DAY,
      	  lift.FIRST_DATE AS FIRST_DATE,
          JSON_ARRAYAGG(
              JSON_OBJECT('type',
                  IF(
                      ISNULL(messages.CONTENT),
                      IF(
                        ISNULL(messages.AUDIO),
                        3,
                        2
                      ),
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
                              'id',
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
          LEFT JOIN
              messages 
              ON lift_map.LIFT_ID = messages.LIFT_ID 
          LEFT JOIN
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
                    'type', CAR_TYPE,
                    'color', CAR_COLOR
                ),
                'departAt', LIFT_DEPART,
                'arriveBy', LIFT_ARRIVE,
                'destination', JSON_OBJECT(
              	  'name', DESTINATION_CITY,
                  'id', DESTINATION_ID
                ),
                'start', JSON_OBJECT(
                    'name', START_CITY,
                    'id', START_ID
                ),
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
                'passengers', JSON_QUERY(IFNULL(JSON_MEMBERS, JSON_ARRAY()), '$'),
                'messages', JSON_QUERY(IFNULL(JSON_MESSAGES, JSON_ARRAY()), '$'),
                'repeatsOn', REPEAT_DAY,
                'date', FIRST_DATE
            )
        ),
        JSON_ARRAY()
    )
    AS JSON
FROM lifts
  `,
      [uid]
    ).catch((err) => {
      throw err;
    })
  ).result[0].JSON;
  return lift_data;
}

async function getLiftRequests(uid) {
  var db_requests = (
    await runQuery(
      `
  (
    SELECT
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'liftId',
                  lift.UUID,
                  'requestingUsers',
                  JSON_ARRAY(
                      JSON_OBJECT(
                          'id',
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
              ) 
          ) AS JSON 
      FROM
      users me 
      JOIN
          lift_map my_lifts 
          ON my_lifts.USER_ID = me.ID 
          AND my_lifts.IS_DRIVER = 1 
      JOIN lift
      	  ON my_lifts.LIFT_ID = lift.ID
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
      WHERE
      me.FB_ID = ?
      GROUP BY
      my_lifts.LIFT_ID
  )
  `,
      [uid]
    )
  ).result;
  var arr = [];
  db_requests.forEach((r) => {
    var a = JSON.parse(r["JSON"]);
    if (a.length > 1) {
      // more requests, have to merge them
      var b = {};
      a.forEach((s, index) => {
        if (index == 0) b = s;
        else b.requestingUsers.push(s.requestingUsers[0]); // always only one user request in there
      });
      arr.push(b);
    } else {
      arr.push(a[0]);
    }
  });

  return JSON.stringify(arr);
}

async function getMarketplace(fbid) {
  let JSON = (
    await runQuery(
      `
  WITH
  lifts as (
      SELECT
        lift.ID AS LIFT_ID,
        lift.UUID,
        driver.FB_ID AS DRIVER_FB_ID,
        driver.NAME AS DRIVER_NAME,
        driver.SURNAME AS DRIVER_SURNAME,
        driver.PREF_TALK AS DRIVER_PREF_TALK,
        driver.PREF_TALK_MORNING AS DRIVER_PREF_TALKMORNING,
        driver.PREF_SMOKING AS DRIVER_PREF_SMOKING,
        driver.PREF_MUSIC AS DRIVER_PREF_MUSIC,
        lift.DEPART_AT AS LIFT_DEPART,
        lift.ARRIVE_BY AS LIFT_ARRIVE,
        lift.FIRST_DATE AS FIRST_DATE,
        lift.REPEATS_ON_WEEKDAY AS REPEAT_DAY,
        (
            IF(
                start_point.ID <= 3,
                start_point.ID,
                -1
            )
        ) AS START_ID,
        (
            IF(
                start_point.ID <= 3,
                start_point.NICKNAME,
                start_point.CITY
            )
        ) AS START_CITY,
        (
            IF(
                dest_point.ID <= 3,
                dest_point.ID,
                -1
            )
        ) AS DESTINATION_ID,
        (
            IF(
                dest_point.ID <= 3,
                dest_point.NICKNAME,
                dest_point.CITY
            )
        ) AS DESTINATION_CITY,
        lift.OFFERED_SEATS AS OFFERED_SEATS,
        lifts_without_me.SEATS AS OCCUPIED_SEATS
      FROM
      (
        WITH a AS(
          SELECT
              LIFT_ID,
              COUNT(*) AS WITH_ME
          FROM
              lift_map
          GROUP BY
              lift_map.LIFT_ID
        ),
        b AS(
        SELECT
            LIFT_ID,
            COUNT(*) AS WITHOUT_ME
        FROM
            lift_map
            JOIN users
            ON users.ID = lift_map.USER_ID
        WHERE
            users.FB_ID != ?
        GROUP BY
            lift_map.LIFT_ID
        )
        SELECT
            a.LIFT_ID AS ID,
            a.WITH_ME AS SEATS
        FROM
            a
        JOIN b ON a.LIFT_ID = b.LIFT_ID AND a.WITH_ME = b.WITHOUT_ME
      ) AS lifts_without_me
      JOIN lift USING(ID)
      JOIN addresses start_point ON
          start_point.ID = lift.START
      JOIN addresses dest_point ON
          dest_point.ID = lift.DESTINATION
      JOIN lift_map driver_map ON
          driver_map.LIFT_ID = lifts_without_me.ID
      JOIN users driver ON
          driver.ID = driver_map.USER_ID AND driver_map.IS_DRIVER = 1
      WHERE
          lift.FIRST_DATE >= CURRENT_DATE() OR lift.REPEATS_ON_WEEKDAY != 0
    )
  
  SELECT
  IFNULL(
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', lifts.UUID,
            'liftId', lifts.LIFT_ID,
              'driver', JSON_OBJECT(
                'id', lifts.DRIVER_FB_ID,
                'name', lifts.DRIVER_NAME,
                'surname', lifts.DRIVER_SURNAME,
                'prefs', JSON_OBJECT(
                      'talk', DRIVER_PREF_TALK,
                      'talkMorning', DRIVER_PREF_TALKMORNING,
                      'smoking', DRIVER_PREF_SMOKING,
                      'music', DRIVER_PREF_MUSIC
                  )
              ),
              'departAt', lifts.LIFT_DEPART,
              'arriveBy', lifts.LIFT_ARRIVE,
              'destination', JSON_OBJECT(
              	  'name', lifts.DESTINATION_CITY,
                  'id', lifts.DESTINATION_ID
              ),
              'start', JSON_OBJECT(
              	  'name', lifts.START_CITY,
                  'id', lifts.START_ID
              ),
              'seatsOffered', lifts.OFFERED_SEATS,
              'seatsOccupied', lifts.OCCUPIED_SEATS,
              'repeatsOn', lifts.REPEAT_DAY,
              'date', lifts.FIRST_DATE
          )
      ), '[]') AS JSON
  FROM
    lifts
        `,
      [fbid]
    )
  ).result[0].JSON;
  return JSON;
}

async function getOutgoingRequests(fbid) {
  let JSON = (
    await runQuery(
      `
  WITH
  lifts as (
      SELECT
        lift.ID AS LIFT_ID,
        lift.UUID,
        driver.FB_ID AS DRIVER_FB_ID,
        driver.NAME AS DRIVER_NAME,
        driver.SURNAME AS DRIVER_SURNAME,
        driver.PREF_TALK AS DRIVER_PREF_TALK,
        driver.PREF_TALK_MORNING AS DRIVER_PREF_TALKMORNING,
        driver.PREF_SMOKING AS DRIVER_PREF_SMOKING,
        driver.PREF_MUSIC AS DRIVER_PREF_MUSIC,
        lift.DEPART_AT AS LIFT_DEPART,
        lift.ARRIVE_BY AS LIFT_ARRIVE,
        lift.FIRST_DATE AS FIRST_DATE,
        lift.REPEATS_ON_WEEKDAY AS REPEAT_DAY,
        (
            IF(
                start_point.ID <= 3,
                start_point.ID,
                -1 -- -1 when it's a user address
            )
        ) AS START_ID,
        (
            IF(
                start_point.ID <= 3,
                start_point.NICKNAME, -- when a campus, show nickname instead of city
                start_point.CITY
            )
        ) AS START_CITY,
        (
            IF(
                dest_point.ID <= 3,
                dest_point.ID,
                -1
            )
        ) AS DESTINATION_ID,
        (
            IF(
                dest_point.ID <= 3,
                dest_point.NICKNAME,
                dest_point.CITY
            )
        ) AS DESTINATION_CITY,
        lift.OFFERED_SEATS AS OFFERED_SEATS,
        pending_with_seats.SEATS AS OCCUPIED_SEATS
      FROM
      (
        WITH a AS(
          SELECT
              LIFT_ID,
              COUNT(*) AS SEATS
          FROM
              lift_map
          WHERE lift_map.PENDING = 0
          GROUP BY
              lift_map.LIFT_ID
        ), -- table returns the number of occupied seats per lift
        b AS(
         SELECT LIFT_ID
         FROM lift_map
         WHERE lift_map.PENDING = 1 AND lift_map.USER_ID = (SELECT ID FROM users WHERE FB_ID = ?)
        ) -- table returns the ids of the lifts where the user has a pending request
        SELECT
            a.LIFT_ID AS ID,
            a.SEATS AS SEATS
        FROM
            a
        JOIN b USING(LIFT_ID) -- returns seats where user has pending request
      ) AS pending_with_seats
      JOIN lift USING(ID)
      JOIN addresses start_point ON
          start_point.ID = lift.START
      JOIN addresses dest_point ON
          dest_point.ID = lift.DESTINATION
      JOIN lift_map driver_map ON
          driver_map.LIFT_ID = pending_with_seats.ID
      JOIN users driver ON
          driver.ID = driver_map.USER_ID AND driver_map.IS_DRIVER = 1
      WHERE
          lift.FIRST_DATE >= CURRENT_DATE() OR lift.REPEATS_ON_WEEKDAY != 0
    )
  
  SELECT
  IFNULL(
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', lifts.UUID,
            'liftId', lifts.LIFT_ID,
              'driver', JSON_OBJECT(
                'id', lifts.DRIVER_FB_ID,
                'name', lifts.DRIVER_NAME,
                'surname', lifts.DRIVER_SURNAME,
                'prefs', JSON_OBJECT(
                      'talk', DRIVER_PREF_TALK,
                      'talkMorning', DRIVER_PREF_TALKMORNING,
                      'smoking', DRIVER_PREF_SMOKING,
                      'music', DRIVER_PREF_MUSIC
                  )
              ),
              'departAt', lifts.LIFT_DEPART,
              'arriveBy', lifts.LIFT_ARRIVE,
              'destination', JSON_OBJECT(
              	  'name', lifts.DESTINATION_CITY,
                  'id', lifts.DESTINATION_ID
              ),
              'start', JSON_OBJECT(
              	  'name', lifts.START_CITY,
                  'id', lifts.START_ID
              ),
              'seatsOffered', lifts.OFFERED_SEATS,
              'seatsOccupied', lifts.OCCUPIED_SEATS,
              'repeatsOn', lifts.REPEAT_DAY,
              'date', lifts.FIRST_DATE
          )
      ), '[]') AS JSON
  FROM
    lifts
        `,
      [fbid]
    )
  ).result[0].JSON;
  return JSON;
}

async function getMarketplaceOfferByUuid(uuidOnly, invitingUserId) {
  let JSON = await runQuery(
    `
  WITH
    lifts AS(
    SELECT DISTINCT
        lift.ID AS ID,
        lift.UUID AS UUID,
        driver.FB_ID AS DRIVER_FB_ID,
        driver.NAME AS DRIVER_NAME,
        driver.SURNAME AS DRIVER_SURNAME,
        driver.PREF_TALK AS DRIVER_PREF_TALK,
        driver.PREF_TALK_MORNING AS DRIVER_PREF_TALKMORNING,
        driver.PREF_SMOKING AS DRIVER_PREF_SMOKING,
        driver.PREF_MUSIC AS DRIVER_PREF_MUSIC,
        lift.DEPART_AT AS LIFT_DEPART,
        lift.ARRIVE_BY AS LIFT_ARRIVE,
        (
            IF(
                destination.ID <= 3,
                destination.NICKNAME,
                destination.CITY
            )
        ) AS DESTINATION_CITY,
        (
            IF(
                destination.ID <= 3,
                destination.ID,
                -1
            )
        ) AS DESTINATION_ID,
        (
            IF(
                start_point.ID <= 3,
                start_point.NICKNAME,
                start_point.CITY
            )
        ) AS START_CITY,
        (
            IF(
                start_point.ID <= 3,
                start_point.ID,
                -1
            )
        ) AS START_ID,
        lift.OFFERED_SEATS,
        IFNULL(counts.OCCUPIED_SEATS, 0) AS OCCUPIED_SEATS,
        lift.REPEATS_ON_WEEKDAY AS REPEAT_DAY,
        lift.FIRST_DATE AS FIRST_DATE,
        inviting_user.NAME AS INVITING_USER_NAME
    FROM
        lift
    JOIN lift_map ON lift_map.LIFT_ID = lift.ID
    JOIN users driver ON
        lift_map.USER_ID = driver.ID AND lift_map.IS_DRIVER = 1
    JOIN users inviting_user ON
    	inviting_user.FB_ID = ?
    JOIN addresses destination ON
        lift.DESTINATION = destination.ID
    JOIN addresses start_point ON
        lift.START = start_point.ID
    JOIN lift_map map_user_filter ON
        lift.ID = map_user_filter.LIFT_ID AND map_user_filter.IS_DRIVER = 1
    JOIN users user_filter ON
        user_filter.ID = map_user_filter.USER_ID
    LEFT OUTER JOIN(
        SELECT lift_map.LIFT_ID,
            COUNT(*) AS OCCUPIED_SEATS
        FROM
            lift_map
        WHERE
            lift_map.PENDING != 0
        GROUP BY
            lift_map.LIFT_ID
    ) counts
ON
    lift.ID = counts.LIFT_ID
WHERE
    -- AND user_filter.FB_ID != 
    lift.UUID = ?
)
SELECT
    JSON_ARRAYAGG(
        JSON_OBJECT(
          'invitingUserName',
          lifts.INVITING_USER_NAME,
            'id',
            lifts.UUID,
            'liftId',
            lifts.ID,
            'driver',
            JSON_OBJECT(
                'id',
                lifts.DRIVER_FB_ID,
                'name',
                lifts.DRIVER_NAME,
                'surname',
                lifts.DRIVER_SURNAME,
                'prefs',
                JSON_OBJECT(
                    'talk',
                    DRIVER_PREF_TALK,
                    'talkMorning',
                    DRIVER_PREF_TALKMORNING,
                    'smoking',
                    DRIVER_PREF_SMOKING,
                    'music',
                    DRIVER_PREF_MUSIC
                )
            ),
            'departAt',
            lifts.LIFT_DEPART,
            'arriveBy',
            lifts.LIFT_ARRIVE,
            'destination',
            JSON_OBJECT(
                'name',
                lifts.DESTINATION_CITY,
                'id',
                lifts.DESTINATION_ID
            ),
            'start',
            JSON_OBJECT(
                'name',
                lifts.START_CITY,
                'id',
                lifts.START_ID
            ),
            'seatsOffered',
            lifts.OFFERED_SEATS,
            'seatsOccupied',
            lifts.OCCUPIED_SEATS,
            'repeatsOn',
            lifts.REPEAT_DAY,
            'date',
            lifts.FIRST_DATE
        )
    ) AS JSON
FROM
    lifts
        `,
    [invitingUserId, uuidOnly]
  );
  if (JSON == null) return null;
  else return JSON.result[0].JSON;
}

async function getFriends(fbId) {
  var friendsFormatted = (
    await runQuery(
      `
    WITH user_data AS( /* just to have ID of current user always accessible */
    SELECT ID, FB_ID
    FROM users
    WHERE FB_ID = ?
),
lefts AS( /* all records where current user is standing left */
	SELECT f.ID, f.TO_U AS USER_ID, 0 AS IS_IN, 1 AS IS_ME
    FROM friends f
	JOIN user_data 
    ON user_data.ID = f.FROM_U
),
rights AS( /* all records where current user is standing right */
	SELECT f.ID, f.FROM_U AS USER_ID, 1 AS IS_IN, 0 AS IS_ME
    FROM friends f
	JOIN user_data
    ON user_data.ID = f.TO_U
),
all_ids_from_real_friends AS(
    SELECT l.ID
    FROM lefts l
	JOIN rights
    ON l.USER_ID = rights.USER_ID
    UNION
    SELECT r.ID
    FROM lefts
	JOIN rights r
    ON r.USER_ID = lefts.USER_ID
),
real_friends AS( /* all records where the other user of lefts and rights are matching */
	SELECT DISTINCT l.ID, l.USER_ID, 1 AS IS_IN, 1 AS IS_ME
    FROM lefts l
	JOIN rights
    ON l.USER_ID = rights.USER_ID
),
altogether AS(
    SELECT ID, USER_ID, IS_IN, IS_ME
    FROM
    real_friends
    UNION
    SELECT ID, USER_ID, IS_IN, IS_ME
    FROM
    rights
    UNION
    SELECT ID, USER_ID, IS_IN, IS_ME
    FROM
    lefts
),
with_user_data AS(
    SELECT NAME, SURNAME, FB_ID, IS_IN, IS_ME
    FROM altogether a
    JOIN users ON users.ID = a.USER_ID
)
  SELECT
      IFNULL(JSON_ARRAYAGG(
          JSON_OBJECT(
            'fbId',
            FB_ID,
              'name',
              NAME,
              'surname',
              SURNAME,
              'friended',
              JSON_OBJECT(
                  'in',
                  IF(IS_IN, true, false),
                  'me',
                  IF(IS_ME, true, false)
              )
          )
      ), '[]') AS JSON
  FROM
      with_user_data
  `,
      [fbId]
    )
  ).result[0].JSON;

  friendsFormatted = JSON.parse(friendsFormatted);

  return friendsFormatted;
}

function endWithJSON(res, JSON) {
  if (res.sent == true) return;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON);
}

async function isUserVerified(fbid) {
  let result = (
    await runQuery(
      `
  SELECT VERIFIED FROM users WHERE FB_ID = ?
  `,
      [fbid]
    )
  ).result[0];
  return result ? result.VERIFIED === 1 : false;
}

module.exports = {
  GET: {
    "/ping": async (req, res, options) => {
      res.end("pong");
    },
    "/sqlTest": async (req, res, options) => {
      let result = await runQuery("SELECT * FROM `test`");
      res.end(JSON.stringify(result));
    },
    "/profilePicture": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["fbid"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        let result = await runQuery(
          "SELECT PICTURE FROM `users` WHERE users.FB_ID = ?",
          [options.fbid]
        );
        res.setHeader("Content-Type", "image/png");
        res.end(result.result[0].PICTURE, "binary");
      }
    },
    "/getNewsticker": async (req, res, options) => {
      var claims = require("./news/dhbw/claims"),
        rnd = Math.floor(Math.random() * claims.length),
        line = claims[rnd];

      endWithJSON(
        res,
        JSON.stringify({
          ticker: line,
        })
      );
    },
    "/loadMessageMedia": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["uuid"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var content = (
          await runQuery(
            "SELECT IFNULL(messages.AUDIO, messages.PICTURE) AS CONTENT FROM messages WHERE messages.UUID = ?",
            [options.uuid]
          )
        ).result[0].CONTENT;

        /* res.setHeader('Content-Type', 'image/png');
        res.end(result.result[0].PICTURE, 'binary'); */

        res.end(content);
      }
    },
    "/getUserData": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["fbid"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var data;
        if (options.secretFbId == options.fbid) {
          // ACCESSING PRIVATE PROFILE
          data = (
            await runQuery(
              `
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
                  users.LIFT_MAX_DISTANCE,
                  users.DEFAULT_ADDRESS
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
                @userid as USER_ID
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
                  '$.addresses', JSON_COMPACT(
                      (SELECT
                          JSON_ARRAYAGG(
                              JSON_OBJECT(
                                  'id', user_addresses.ID,
                                  'nickname', user_addresses.NICKNAME,
                                  'postcode', user_addresses.POSTCODE,
                                  'city', user_addresses.CITY,
                                  'street', user_addresses.STREET,
                                  'number', user_addresses.NUMBER,
                                  'isDefault', IF(user_addresses.ID = data.DEFAULT_ADDRESS, TRUE, FALSE)
                              )
                          ) from user_addresses
                     )
                  ),
                  '$.cars', JSON_QUERY(
                      IFNULL(
                          (SELECT
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
                              ) from cars
                          ),
                          JSON_ARRAY()
                      ),
                      '$'
                  )
              ) AS JSON
          FROM
              data 
              LEFT OUTER JOIN
                  rides USING(USER_ID) 
              LEFT OUTER JOIN
                  drives USING(USER_ID)
            `,
              [options.fbid]
            ).catch((err) => {
              errorHandler.database(
                "getUserData",
                options,
                err,
                "Could not get user data",
                res
              );
            })
          ).result[1][0].JSON;

          data = JSON.parse(data);
          data.chatLifts = JSON.parse(await getChatLifts(options.fbid));

          data.liftRequests = JSON.parse(await getLiftRequests(options.fbid));

          data.outgoingRequests = JSON.parse(
            await getOutgoingRequests(options.fbid)
          );

          data["topFriends"] = apiResponseSimulation["topFriends"];
          data["friends"] = await getFriends(options.fbid);
        } else {
          // accessing public information
          data = (
            await runQuery(
              `
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
            `,
              [options.fbid]
            ).catch(async (err) => {
              res = await errorHandler.database(
                "getUserData",
                options,
                err,
                "Could not get public user data",
                res
              );
            })
          ).result[1][0].JSON;

          data = JSON.parse(data);
        }
        data.stats.liftsOffered = Math.floor(Math.random() * 100);
        data.stats.liftsAll =
          data.stats.liftsOffered + Math.floor(Math.random() * 200);
        data.marketplaceOffers = JSON.parse(
          await getMarketplace(options.secretFbId)
        );

        endWithJSON(res, JSON.stringify(data));
      }
    },
    "/getCarModels": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        let result = await runQuery("SELECT BRAND, MODEL FROM car_models", []);
        let cars = result.result;
        let carsObj = {};

        cars.forEach((item) => {
          if (!carsObj[item.BRAND]) {
            // when brand not initialized, then do it
            carsObj[item.BRAND] = [];
          }
          if (carsObj[item.BRAND].indexOf(item.MODEL) == -1) {
            // models should not exist twice in array
            carsObj[item.BRAND].push(item.MODEL);
          } // basically grouped all cars in object array
        });

        endWithJSON(res, JSON.stringify(carsObj));
      }
    },
    "/getMessages": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        var a = await getChatLifts(options.secretFbId);

        endWithJSON(res, a);
      }
    },
    "/getLegal": async (req, res, options) => {
      var filename = null;

      switch (options.view) {
        case "agb":
          filename = "terms_of_use";
          break;
        case "dataSec":
          filename = "data_security";
          break;
      }
      if (!filename) {
        res.writeHead(404);
      } else
        fs.readFile(`legal/${filename}.html`, "utf8", (err, data) => {
          if (err)
            errorHandler.file(
              "getLegal",
              err,
              'Could not read file "' + filename + ".html",
              res
            );
          else
            endWithJSON(
              res,
              JSON.stringify({
                text: data,
              })
            );
        });
    },
    "/getSupportData": async (req, res, options) => {
      var result = (
          await runQuery(
            `SELECT faq.ID, faq.QUESTION, faq.CATEGORY, faq.ANSWER, users.NAME AS ORGAS_NAME, team.FUNCTION, team.ID AS ORGA_ID 
      FROM faq JOIN team ON team.ID = faq.ANSWERED_BY LEFT JOIN users ON users.ID = faq.ANSWERED_BY	
    WHERE IS_PUBLIC = 1`,
            []
          )
        ).result,
        faqArr = [],
        tutArr = [];
      result.forEach((item) => {
        faqArr.push({
          id: item.ID,
          question: item.QUESTION,
          answer: item.ANSWER,
          category: item.CATEGORY,
          answeredBy: {
            id: item.ORGA_ID,
            name: item.ORGAS_NAME.split(" ")[0],
            function: item.FUNCTION,
          },
        });
      });
      result = (
        await runQuery(
          "SELECT ID, TITLE, CAPTION, URL FROM tutorials WHERE PUBLIC = 1"
        )
      ).result;
      if (result[0])
        result.forEach((video) => {
          tutArr.push({
            id: video.ID,
            title: video.TITLE,
            caption: video.CAPTION || "",
            url: video.URL,
          });
        });

      endWithJSON(
        res,
        JSON.stringify({
          faq: faqArr,
          tutorials: tutArr,
        })
      );
    },
    "/getAllFAQ": async (req, res, options) => {
      var result = (
          await runQuery(
            `SELECT faq.*, users.NAME AS ORGAS_NAME, orgas.FUNCTION 	
    FROM faq JOIN orgas ON orgas.ID = faq.ANSWERED_BY 	
    JOIN users ON users.ID = faq.ANSWERED_BY`,
            []
          )
        ).result,
        obj = {
          bedienung: [],
          sonstiges: [],
        };
      result.forEach((item) => {
        obj[item.CATEGORY.toLowerCase()].push({
          id: item.ID,
          question: item.QUESTION,
          askedBy: item.FIRST_NAME,
          answer: item.ANSWER,
          answeredBy: item.ORGAS_NAME.split(" ")[0],
          isPublic: item.IS_PUBLIC,
          lastChange: item.LAST_CHANGE,
        });
      });

      endWithJSON(res, JSON.stringify(obj));
    },
    "/getTeamInfo": async (req, res, options) => {
      if (isUserVerified(options.secretFbId)) {
        var team = (await runQuery("SELECT * from team WHERE ID != 0")).result,
          about = "",
          teamArr = [];

        about = await new Promise((resolve, reject) =>
          fs.readFile("legal/about.html", "utf8", (err, data) => {
            if (err) {
              about = err;
              errorHandler.file(
                "getTeamInfo",
                err,
                "Could not read the about file",
                res
              );
            } else resolve(data);
          })
        );

        team.forEach(async (m) => {
          let teamElem = {
            id: m.ID,
            name: m.NAME,
            surname: m.SURNAME,
            function: m.FUNCTION,
            funcShort: m.FUNC_SHORT || null,
            bio: m.BIO,
            picture: Buffer.from(m.PICTURE).toString("base64"),
          };
          teamArr.push(teamElem);
        });

        var obj = {
          team: teamArr,
          infoText: about,
        };

        endWithJSON(res, JSON.stringify(obj));
      }
    },
    "/chatPicture": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["msgId"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        let pic = (
          await runQuery(
            `
        SELECT messages.PICTURE from messages
        join lift_map on messages.LIFT_ID = lift_map.LIFT_ID
        join users.ID = lift_map.USER_ID
        where users.FB_ID = ?
        AND lift_map.PENDING = 0
        AND messages.UUID = ?`,
            [options.secretFbId, options.msgId]
          )
        ).result[0].PICTURE;
        res.setHeader("Content-Type", "image/jpg");
        res.end(pic, "binary");
      }
    },
    "/chatAudio": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["msgId"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        let audio = (
          await runQuery(
            `
        SELECT messages.AUDIO from messages
        join lift_map on messages.LIFT_ID = lift_map.LIFT_ID
        join users.ID = lift_map.USER_ID
        where users.FB_ID = ?
        AND lift_map.PENDING = 0
        AND messages.UUID = ?`,
            [options.secretFbId, options.msgId]
          )
        ).result[0].AUDIO;
        res.setHeader("Content-Type", "application/octet-stream");
        res.end(audio, "binary");
      }
    },
    "/marketplace": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        endWithJSON(res, await getMarketplace(options.secretFbId)); // normal, simple marketplace offers are wanted
      } else {
        console.log("not verified");
        res.end();
      }
    },
    "/specificMarketplaceOffer": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        var offers = JSON.parse(
          await getMarketplaceOfferByUuid(options.uuid, options.invitingUserId)
        );
        if (offers != null) {
          (wantedOffer = offers[0]), // when specific uuid is wanted, then only one result will be there, which should be returned as single object and not as array with just one element
            (invitingUserName = wantedOffer.invitingUserName);
          delete wantedOffer.invitingUserName;
          endWithJSON(
            res,
            JSON.stringify({
              lift: wantedOffer,
              invitingUserName: invitingUserName,
            })
          );
        } else {
          errorLogDatabase("specificMarketplaceOffer", options);
          res.writeHead(404);
          res.end("Database returned no data");
        }
      }
    },
    "/liftRequests": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        endWithJSON(
          res,
          JSON.stringify({
            requests: JSON.parse(await getLiftRequests(options.secretFbId)),
          })
        );
      }
    },
    "/outgoingRequests": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        endWithJSON(
          res,
          JSON.stringify({
            requests: JSON.parse(await getOutgoingRequests(options.secretFbId)),
          })
        );
      }
    },
    "/getFriends": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        endWithJSON(
          res,
          JSON.stringify({
            friends: await getFriends(options.secretFbId),
          })
        );
      }
    },
  },
  POST: {
    "/apiTest": async (req, res, options) => {
      var a;
      await runQuery("SELECT * FROM fail", []).catch(async (err) => {
        res = await errorHandler.database(
          "apiTest",
          options,
          err,
          "custom err",
          res
        );
      });

      // leave this part
      if (typeof a == "object") a = JSON.stringify(a);
      endWithJSON(res, a);
    },
    "/apiTest": async (req, res, options) => {
      // leave this part
      endWithJSON(
        res,
        JSON.stringify({
          msg: "Hello, " + options.name,
        })
      );
    },
    "/createUserIfNotExisting": async (req, res, options) => {
      if (!isOptionMissing(options, ["name", "surname", "mail"], res)) {
        let user = await getUserId(options.secretFbId);
        if (!user) {
          let png = generateJdenticon(options.name);
          await runQuery(
            "INSERT INTO `users` (`ID`, `FB_ID`, `NAME`, `SURNAME`, `GENDER`, `COURSE`, `PICTURE`, `DESCRIPTION`, `CREATED_DATE`, `MAIL`, `PREF_SMOKING`, `PREF_MUSIC`, `PREF_TALK`, `PREF_TALK_MORNING`, `VERIFIED`)" +
              "VALUES (NULL, ?, ?, ?, 'X', '', ?, '', NULL, ?, 'RED', 'RED', 'RED', 'RED', 1)",
            [
              options.secretFbId,
              options.name,
              options.surname,
              png,
              options.mail,
            ]
          ).catch((error) => {
            throw error;
          });
          res.end("added");
        }
        res.end("existed");
      }
    },
    "/updateDescription": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["description"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        await runQuery(
          "UPDATE `users` SET `DESCRIPTION` = ? WHERE `users`.`FB_ID` = ?",
          [options.description, options.secretFbId]
        ).catch((error) => {
          throw error;
        });
        res.end();
      }
    },
    "/updateGender": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["gender"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        await runQuery(
          "UPDATE `users` SET `GENDER` = ? WHERE `users`.`FB_ID` = ?",
          [options.gender, options.secretFbId]
        ).catch((error) => {
          throw error;
        });
        res.end();
      }
    },
    "/updateLiftMaxDistance": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["liftMaxDistance"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        await runQuery(
          "UPDATE `users` SET `LIFT_MAX_DISTANCE` = ? WHERE `users`.`FB_ID` = ?",
          [options.liftMaxDistance, options.secretFbId]
        ).catch((error) => {
          throw error;
        });
        res.end();
      }
    },
    "/updateProfilePicture": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["imageData"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var img = Buffer.from(options.imageData.substr(22), "base64");
        var dimensions = require("image-size")(img);
        if (!(dimensions.width == 300 && dimensions.height == 300)) {
          res.writeHead(400);
          res.end("Image must be 300x300");
        }
        await runQuery(
          "UPDATE `users` SET `PICTURE` = ? WHERE `users`.`FB_ID` = ?",
          [img, options.secretFbId]
        ).catch(async (err) => {
          res = await errorHandler.database(
            "updateProfilePicture",
            options,
            err,
            "Could not update profile picture",
            res
          );
        });
        res.end();
      }
    },
    "/resetProfilePicture": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        var name = (
          await runQuery("SELECT NAME FROM `users` WHERE users.FB_ID = ?", [
            options.secretFbId,
          ])
        ).result[0].NAME;
        await runQuery(
          "UPDATE `users` SET `PICTURE` = ? WHERE `users`.`FB_ID` = ?",
          [generateJdenticon(name), options.secretFbId]
        ).catch(async (err) => {
          res = await errorHandler.database(
            "resetProfilePicture",
            options,
            err,
            "",
            res
          );
        });
        res.end();
      }
    },
    "/updatePrefs": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["prefs"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        await runQuery(
          "UPDATE users SET PREF_TALK = ?, PREF_TALK_MORNING = ?, PREF_SMOKING = ?, PREF_MUSIC = ? WHERE FB_ID = ?;",
          [
            options.prefs.talk,
            options.prefs.talkMorning,
            options.prefs.smoking,
            options.prefs.music,
            options.secretFbId,
          ]
        ).catch(async (err) => {
          res = await errorHandler.database(
            "updatePrefs",
            options,
            err,
            "",
            res
          );
        });
        res.end();
      }
    },
    "/addLiftRequest": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["liftId"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var uid = options.secretFbId,
          liftId = options.liftId;
        await runQuery(
          "INSERT INTO lift_map (USER_ID, LIFT_ID) VALUES ((SELECT ID FROM users WHERE FB_ID = ?), (SELECT ID FROM lift WHERE UUID = ?))",
          [uid, liftId]
        ).catch(async (err) => {
          if (!errorHandler.isDuplicateEntry(err))
            res = await errorHandler.database(
              "addLiftRequest",
              options,
              err,
              "",
              res
            );
          // when duplicate entry, don't inform the client, but continue on, client will then remove offer from marketplace and is fine
        });
        res.end();
      }
    },
    "/respondRequest": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["accepted", "liftId", "userId"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var uid = options.secretFbId,
          liftId = options.liftId,
          accepted = options.accepted,
          requestingUserId = options.userId;
        if (requestingUserId == -1) {
          // all requests of specific lift should be responded
          if (accepted) {
            await runQuery(
              `INSERT INTO messages( UUID, CONTENT, FROM_USER_ID, LIFT_ID, TIMESTAMP )
            VALUES(
              MD5(NOW(6)),
                'Alle anfragenden Nutzer wurden der Fahrt hinzugefügt',
                0,
                ( SELECT ID FROM lift WHERE lift.UUID = ? ),
                CURRENT_TIMESTAMP())`,
              [liftId]
            );
            await runQuery(
              "UPDATE lift_map SET PENDING = 0 WHERE lift_map.LIFT_ID = (SELECT ID FROM lift WHERE UUID = ?)",
              [liftId]
            ); // simply set all relations of that lift to 1
          } else {
            res.writeHead(500);
            res.end("Not implemented yet");
          }
        } else {
          if (accepted) {
            await runQuery(
              "UPDATE lift_map SET PENDING = 0 WHERE LIFT_ID = ( SELECT ID FROM lift WHERE lift.UUID = ? ) AND USER_ID = ( SELECT ID FROM users WHERE users.FB_ID = ? ) AND ",
              [liftId, requestingUserId]
            );
            await runQuery(
              `INSERT INTO messages( UUID, CONTENT, FROM_USER_ID, LIFT_ID, TIMESTAMP )
            VALUES(
              MD5(NOW(6)), 
              CONCAT(
                ( SELECT NAME FROM users WHERE users.FB_ID = ? ),
                ' ist der Fahrt beigetreten'),
                0,
                ( SELECT ID FROM lift WHERE lift.UUID = ? ),
                CURRENT_TIMESTAMP())`,
              [requestingUserId, liftId]
            );
          } else
            await runQuery(
              "DELETE FROM lift_map WHERE LIFT_ID = ( SELECT ID FROM lift WHERE lift.UUID = ? ) AND USER_ID = ( SELECT ID FROM users WHERE users.FB_ID = ? )",
              [liftId, requestingUserId]
            );
        }
        res.end();
      }
    },
    "/cancelLiftRequest": async (req, res, options) => {
      if (await isUserVerified(options.secretFbId)) {
        await runQuery(
          `DELETE FROM lift_map 
        WHERE LIFT_ID = (SELECT ID FROM lift WHERE UUID = ?) AND USER_ID = (SELECT ID FROM users WHERE FB_ID = ?) AND PENDING = 1`,
          [options.liftId, options.secretFbId]
        );
        // removes selected entry, PENDING is there for security so that this cannot be used to remove existing passengers
        endWithJSON(res, "");
      }
    },
    "/addAddress": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["address"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var uid = options.secretFbId,
          a = options.address;
        await runQuery(
          "INSERT INTO `addresses` (`ID`, `NICKNAME`, `POSTCODE`, `CITY`, `NUMBER`, `STREET`, `USER_ID`) VALUES (NULL, ?, ?, ?, ?, ?, (SELECT ID FROM users WHERE FB_ID = ?));",
          [a.nickname || "", a.postcode, a.city, a.number, a.street, uid]
        ).catch((err) => {
          errorHandler(err, res, "addAddress");
        });
        var a = (
          await runQuery(
            "SELECT MAX(b.ID) AS MAX FROM ( SELECT ID FROM addresses a WHERE a.CITY = ? AND a.NUMBER = ? AND a.STREET = ? ORDER BY a.ID DESC ) as b",
            [a.city, a.number, a.street]
          )
        ).result[0].MAX;

        endWithJSON(
          res,
          JSON.stringify({
            id: a,
          })
        );
      }
    },
    "/removeAddress": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["id"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        await runQuery("DELETE FROM `addresses` WHERE `addresses`.`ID` = ?", [
          options.id,
        ]).catch(async (err) => {
          res = await errorHandler.database(
            "removeAddress",
            options,
            err,
            "",
            res
          );
        });

        res.end();
      }
    },
    "/updateDefaultAddress": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["id"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        await runQuery(
          "UPDATE `users` SET DEFAULT_ADDRESS = ? WHERE users.FB_ID = ?",
          [options.id, options.secretFbId]
        ).catch(async (err) => {
          res = await errorHandler.database(
            "removeAddress",
            options,
            err,
            "",
            res
          );
        });

        res.end();
      }
    },
    "/addCar": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["car"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var car = options.car,
          uid = options.secretFbId;

        await runQuery(
          "INSERT INTO car (`ID`, `LICENSE_PLATE`, `SEATS`, `MODEL_ID`, `TYPE`, `COLOR`, `YEAR`, `USER_ID`) VALUES (NULL, ?, ?, (SELECT ID FROM car_models WHERE BRAND = ? AND MODEL = ?), ?, ?, ?, (SELECT ID FROM users WHERE FB_ID = ?))",
          [
            car.licensePlate,
            car.seats,
            car.brand,
            car.model,
            car.type,
            car.color.replace("#", ""),
            car.year,
            uid,
          ]
        ).catch((error) => {
          errorHandler(error, res, "/addCar");
        });
        var createdId = (
          await runQuery(
            "SELECT ID FROM car WHERE LICENSE_PLATE = ? AND COLOR = ?",
            [car.licensePlate, car.color.replace("#", "")]
          )
        ).result[0].ID;

        endWithJSON(
          res,
          JSON.stringify({
            id: createdId,
          })
        );
      }
    },
    "/removeCar": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["id"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        await runQuery("DELETE FROM car WHERE ID = ?", [options.id]).catch(
          async (err) => {
            res = errorHandler.database(
              "removeCar",
              options,
              err,
              "Could not remove car",
              res
            );
          }
        );
        res.end();
      }
    },
    "/addLift": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["lift"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var lift = options.lift,
          isdepartAt = lift.destination == "school",
          weekday = lift.dateTab == "weekly" ? lift.date : 0,
          fixLiftDate = lift.dateTab == "fix" ? lift.date : null,
          departAt = lift.timeTab == "depart" ? lift.time : "00:00:00",
          arriveBy = lift.timeTab == "arrive" ? lift.time : "00:00:00",
          uid = options.secretFbId;
        content = "Willkommen im Chat!";

        await runQuery(
          "INSERT INTO `lift` (`CREATED_AT`, `OFFERED_SEATS`, `CAR_ID`, `START`, `DESTINATION`, `UUID`, `REPEATS_ON_WEEKDAY`, `FIRST_DATE`, `DEPART_AT`, `ARRIVE_BY`) VALUES (current_timestamp(), ?, ?, ?, ?, SUBSTRING(UUID_SHORT(), -14, 14), ?, ? ,?, ?)",
          [
            lift.seats,
            lift.carId,
            lift.startAddressId,
            lift.destinationAddressId,
            weekday,
            fixLiftDate,
            departAt,
            arriveBy,
          ]
        ).catch(async (err) => {
          res = await errorHandler.database("addLift", options, err, "", res);
        });
        await runQuery(
          "INSERT INTO `lift_map` (`LIFT_ID`, `USER_ID`, `IS_DRIVER`, `PENDING`) SELECT MAX(ID) AS ID, (SELECT ID FROM users WHERE FB_ID = ?) AS USER_ID, 1 AS IS_DRIVER, 0 AS PENDING FROM lift",
          [uid]
        ).catch(async (err) => {
          res = await errorHandler.database("addLift", options, err, "", res);
        });
        await runQuery(
          "INSERT INTO `messages` (`UUID`, `CONTENT`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (MD5(NOW(6)), ?, 0, (SELECT MAX(ID) AS ID FROM lift), current_timestamp())",
          [content]
        ).catch(async (error) => {
          res = await errorHandler.database("addLift", options, err, "", res);
        });

        endWithJSON(res, await getChatLifts(options.secretFbId));
      }
    },
    "/leaveLift": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["liftId"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var uid = options.secretFbId,
          liftId = options.liftId;
        await runQuery(
          `INSERT INTO messages( UUID, CONTENT, FROM_USER_ID, LIFT_ID, TIMESTAMP )
          VALUES(
            MD5(NOW(6)), 
            CONCAT(
              ( SELECT NAME FROM users WHERE users.FB_ID = ? ),
              ' hat die Fahrt verlassen'),
              0,
              ( SELECT ID FROM lift WHERE lift.UUID = ? ),
              CURRENT_TIMESTAMP())`,
          [uid, liftId]
        );
        await runQuery(
          `DELETE
        FROM lift
        WHERE ID = (
        SELECT LIFT_ID
        FROM lift_map
        WHERE USER_ID = (SELECT ID FROM users WHERE FB_ID = ?) AND PENDING = 0 AND IS_DRIVER = 1 AND LIFT_ID =(SELECT ID FROM lift WHERE UUID = ?)
        )`,
          [uid, liftId]
        ); // when lift found where uuid, driver and fbId are matching, then delete that lift. DB is set to cascade, so messages, lift_map, that stuff will be deleted.
        await runQuery(
          "DELETE FROM lift_map WHERE LIFT_ID = (SELECT ID FROM lift WHERE UUID = ?) AND USER_ID = (SELECT ID FROM users WHERE FB_ID = ?)",
          [liftId, uid]
        ); // when lift has been deleted in previous line, this query will affect nothing

        res.end();
      }
    },
    "/updateLiftTime": async (req, res, options) => {
      if (
        !isOptionMissing(
          options,
          ["liftId", "time", "isArriveBy", "date", "isFixDate"],
          res
        ) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var liftId = options.liftId,
          arriveBy =
            (options.isArriveBy == true ? options.time : "00:00") + ":00",
          departAt =
            (options.isArriveBy == false ? options.time : "00:00") + ":00",
          firstDate = options.isFixDate == true ? options.date : null,
          repeats = options.isFixDate == false ? options.date : 0;

        await runQuery(
          `UPDATE lift SET REPEATS_ON_WEEKDAY = ?, FIRST_DATE = ?, DEPART_AT = ?, ARRIVE_BY = ? WHERE lift.UUID = ?`,
          [repeats, firstDate, departAt, arriveBy, liftId]
        ).catch(async (err) => {
          res = await errorHandler.database(
            "updateLiftTime",
            options,
            err,
            "Could not update lift time",
            res
          );
        });
        await runQuery(
          `INSERT INTO messages( UUID, CONTENT, FROM_USER_ID, LIFT_ID, TIMESTAMP )
          VALUES(
            MD5(NOW(6)), 
            CONCAT(
              ( SELECT NAME FROM users WHERE users.FB_ID = ? ),
              ' hat die Fahrtzeiten geändert'),
              0,
              ( SELECT ID FROM lift WHERE lift.UUID = ? ),
              CURRENT_TIMESTAMP())`,
          [options.secretFbId, liftId]
        );
        res.end();
      }
    },
    "/sendMessage": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["message"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var message = options.message;
        if (message.content) {
          switch (message.type) {
            case 1: // text
              await runQuery(
                "INSERT INTO `messages` (`UUID`, `CONTENT`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (MD5(NOW(6)), ?, (SELECT ID FROM users WHERE FB_ID = ?), (SELECT ID FROM lift WHERE UUID = ?), current_timestamp())",
                [message.content, options.secretFbId, message.liftId]
              ).catch((error) => {
                throw error;
              });
              break;
            case 2: // audio blob
              /* var c =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
              console.log(c);
              var blob = await fetch(c);
              console.log(blob); */
              /* await runQuery(
                "INSERT INTO `messages` (`UUID`, `AUDIO`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (MD5(NOW(6)), ?, (SELECT ID FROM users WHERE FB_ID = ?), (SELECT ID FROM lift WHERE UUID = ?), current_timestamp())",
                [blob, options.secretFbId, message.liftId]
              ).catch((error) => {
                throw error;
              }); */
              break;
            case 3: // image blob
              console.log(blob);
              await runQuery(
                "INSERT INTO `messages` (`UUID`, `PICTURE`, `FROM_USER_ID`, `LIFT_ID`, `TIMESTAMP`) VALUES (MD5(NOW(6)), ?, (SELECT ID FROM users WHERE FB_ID = ?), (SELECT ID FROM lift WHERE UUID = ?), current_timestamp())",
                [message.content, userId, liftId]
              ).catch((error) => {
                throw error;
              });
              break;
          }

          let result = await runQuery(
            "SELECT MAX(ID), CURRENT_TIMESTAMP() AS TIME FROM `messages`",
            []
          ).catch((error) => {
            throw error;
          });
          var id = result.result[0]["MAX(ID)"];

          endWithJSON(
            res,
            JSON.stringify({
              id: id,
              timestamp: result.result[0].TIME,
            })
          );
        } else res.end();
      }
    },
    "/changeFriendRelation": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["otherFbId", "mySideOfHeart"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var ownId = options.secretFbId,
          otherFbId = options.otherFbId,
          mySideOfHeart = options.mySideOfHeart; // contains all needed information about the state transition

        if (mySideOfHeart === false) {
          // check absolute equality, is important here
          // rising edge -> insert relation, when already exists catch and do nothing
          runQuery(
            /* escape column names to avoid conflicts with keywoards */
            `INSERT INTO friends (FROM_U, TO_U) VALUES
            (
              (SELECT ID FROM users WHERE FB_ID = ?),
              (SELECT ID FROM users WHERE FB_ID = ?)
              )
              `,
            [ownId, otherFbId]
          ).catch((err) => {
            /* relation already there */
          });
        } else {
          runQuery(
            `DELETE FROM friends WHERE 
            FROM_U = (SELECT ID FROM users WHERE FB_ID = ?) 
            AND TO_U = (SELECT ID FROM users WHERE FB_ID = ?);`,
            [ownId, otherFbId]
          ).catch((_) => {
            /* relation not there any more */
          });
        }
        endWithJSON(
          res,
          JSON.stringify({
            pass: true,
          })
        );
      }
    },
    "/addQuestion": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["question", "category", "uid"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var cat = options.category;

        await runQuery(
          "INSERT INTO `faq` (`QUESTION`, `CATEGORY`, `ASKED_BY`) VALUES (?, ?, ?)",
          [options.question, cat, uid]
        );
        res.end();
      }
    },
    "/updateQuestion": async (req, res, options) => {
      if (
        !isOptionMissing(options, ["data", "mode"], res) &&
        (await isUserVerified(options.secretFbId))
      ) {
        var d = options.data;
        if (options.mode == 1) {
          // normal mode
          await runQuery(
            "UPDATE faq SET ANSWER = ?, ANSWERED_BY = ?, IS_PUBLIC = ? WHERE ID = ?",
            [d.answer, d.orgaId, d.instantPublish, d.id]
          );
        } else {
          // mode is 2, special mode just to set publicity
          await runQuery("UPDATE faq SET IS_PUBLIC = ? WHERE ID = ?", [
            d.newValue,
            d.id,
          ]);
        }

        res.end();
      }
    },
  },
};
