const runQuery = require('./db')
/* var sendmail = require('../sendmail')({ silent: true }) */

module.exports = {
	file: async (endpoint, err, errMsg, res) => {
		/* if (process.env.DEV) return // when in DEV mode, logging is not needed */
		var message = errMsg || 'File procession error',
			httpCode = 400 // not more specified
		await runQuery(`INSERT INTO file_errors (ID, ENDPOINT, FILE_MESSAGE, TIMESTAMP) VALUES (NULL, ?, ?, current_timestamp())`, [endpoint, message])

		res.writeHead(httpCode)
		res.end(message)

		res.send = _ => {
			/* console.log('Skipped res.end(): was already called before') */
		} // overwrite with empty function, will be called when normal code continues on
	},

	database: async (endpoint, options, dbError, errMsg, res) => {
		/* if (process.env.DEV) return // when in DEV mode, logging is not needed */
		var message = 'Database Error',
			httpCode = 400 // not more specified
		if (errMsg) message = errMsg // when a message is already given, that message will be taken and db error be ignored
		else switch (dbError.code) {
			case 'ER_ROW_IS_REFERENCED_2': message = 'Constraint violated'
				httpCode = 424
				break
			case 'ER_DUP_ENTRY': message = 'Primary key or index violated'
				httpCode = 409
				break
		}
		await runQuery(`INSERT INTO database_errors (ID, ENDPOINT, CAUSED_BY, OPTIONS, TIMESTAMP) VALUES 
			(NULL, ?, (SELECT ID FROM users WHERE FB_ID = ?), ?, current_timestamp())`, [endpoint, causedFbId, JSON.stringify(options)])
		res.writeHead(httpCode)
		res.end(message)

		res.end = _ => { } // see explation above
	}
}

function mail (text) { // made for better reactions, will be implemented in future
	sendmail({
		from: 'studicar-dev@mfinn.de',
		to: 'studicar-error@bernd.one',
		replyTo: 'jason@yourdomain.com',
		subject: 'StudiCar DEV Query Error',
		html: text
	}, (err, reply) => {

	})
}