/*

This file is just to store the longer db queries to keep the api code clean.

*/

module.exports = {
    'getMessages': `SELECT messages.*, users.NAME, start_adress.NICKNAME AS START_NICK, dest_adress.NICKNAME AS DEST_NICK 
    FROM messages JOIN lift_map ON lift_map.LIFT_ID = messages.LIFT_ID 
    JOIN users ON FROM_USER_ID = users.ID 
    JOIN lift ON lift.ID = messages.LIFT_ID 
    JOIN adresses AS start_adress ON start_adress.ID = lift.START 
    JOIN adresses AS dest_adress ON dest_adress.ID = lift.DESTINATION 
    WHERE lift_map.USER_ID = ? AND lift_map.PENDING = 0 
    ORDER BY messages.TIMESTAMP DESC;`,
    'getFAQ': `SELECT faq.ID, faq.QUESTION, faq.CATEGORY, faq.ANSWER, users.NAME AS ORGAS_NAME, orgas.FUNCTION, orgas.ID AS ORGA_ID 
    FROM faq JOIN orgas ON orgas.ID = faq.ANSWERED_BY 
    JOIN users ON users.ID = faq.ANSWERED_BY 
    WHERE IS_PUBLIC = 1`,
    'getAllFAQ': `SELECT faq.*, users.NAME AS ORGAS_NAME, orgas.FUNCTION 
    FROM faq JOIN orgas ON orgas.ID = faq.ANSWERED_BY 
    JOIN users ON users.ID = faq.ANSWERED_BY`
}