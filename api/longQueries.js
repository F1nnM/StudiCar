/*

This file is justto store the very long db queries so they don't mess the api code

*/

module.exports = {
    'getMessages': `SELECT messages.*, users.NAME, start_adress.NICKNAME AS START_NICK, dest_adress.NICKNAME AS DEST_NICK 
    FROM messages JOIN lift_map ON lift_map.LIFT_ID = messages.LIFT_ID JOIN users ON FROM_USER_ID = users.ID JOIN lift ON lift.ID = messages.LIFT_ID 
    JOIN adresses AS start_adress ON start_adress.ID = lift.START JOIN adresses AS dest_adress ON dest_adress.ID = lift.DESTINATION 
    WHERE lift_map.USER_ID = ? AND lift_map.PENDING = 0 ORDER BY messages.TIMESTAMP DESC;`
}