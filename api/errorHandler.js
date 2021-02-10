const runQuery = require('./db')

module.exports = async function databaseLog (endpoint, options) {
    var causedFbId = options.secretFbId
    delete options.secretFbId
    delete options.idtoken // just to keep data cleaner
    await runQuery(`INSERT INTO errors (ID, ENDPOINT, CAUSED_BY, OPTIONS, TIMESTAMP) VALUES 
    (NULL, ?, (SELECT ID FROM users WHERE FB_ID = ?), ?, current_timestamp())`, [endpoint, causedFbId, JSON.stringify(options)])
}