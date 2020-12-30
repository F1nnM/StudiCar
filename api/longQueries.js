/*

This file is just to store the longer db queries to keep the api code clean.

*/

module.exports = {
    'getFAQ': `SELECT faq.ID, faq.QUESTION, faq.CATEGORY, faq.ANSWER, team.NAME AS ORGAS_NAME, team.FUNC_SHORT AS FUNCTION, team.ID AS ORGA_ID FROM faq join team on team.id = faq.ASKED_BY WHERE IS_PUBLIC = 1`,
    'getAllFAQ': `SELECT faq.*, users.NAME AS ORGAS_NAME, orgas.FUNCTION 
    FROM faq JOIN orgas ON orgas.ID = faq.ANSWERED_BY 
    JOIN users ON users.ID = faq.ANSWERED_BY`
}