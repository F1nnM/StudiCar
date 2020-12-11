/*

This file is just to store the longer db queries to keep the api code clean.

*/

module.exports = {
    'getFAQ': `SELECT faq.ID, faq.QUESTION, faq.CATEGORY, faq.ANSWER, users.NAME AS ORGAS_NAME, team.FUNCTION, team.ID AS ORGA_ID 
    FROM faq JOIN team ON team.ID = faq.ANSWERED_BY 
    LEFT JOIN users ON users.ID = faq.ANSWERED_BY
    WHERE IS_PUBLIC = 1`,
    'getAllFAQ': `SELECT faq.*, users.NAME AS ORGAS_NAME, orgas.FUNCTION 
    FROM faq JOIN orgas ON orgas.ID = faq.ANSWERED_BY 
    JOIN users ON users.ID = faq.ANSWERED_BY`
}