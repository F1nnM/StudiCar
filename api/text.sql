WITH
	lifts as (
        SELECT
          lift.id,
          lift.UUID AS LIFT_ID,
          car_models.BRAND AS CAR_BRAND,
          car_models.MODEL AS CAR_MODEL,
          car.SEATS AS CAR_SEATS,
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
                    'seatsWithoutDriver', CAR_SEATS,
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