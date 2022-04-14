const db = require("./db");
const runQuery = require("./db"),
  sendmail = require("./sendmail");

function toHTMLTableString(obj) {
  var s = "<table><tr><th>key</th><th>value</th></tr>";
  Object.entries(obj).forEach(([key, value]) => {
    s += `<tr><td class="pr">${key}</td><td>${value}</td></tr>`;
  });
  s += "</table>";
  return s;
}

function closeRequest(res, http, message) {
  res.writeHead(http);
  res.end(message);

  // in earlier versions res.setHeader function was overwritten, but didn't work properly, so decided to work with a flag in property
  res.sent = true;
  return res;
}

module.exports = {
  file: async (endpoint, err, errMsg, res) => {
    /* if (process.env.DEV) return // when in DEV mode, logging is not needed */
    var message = errMsg || "File procession error",
      httpCode = 400; // not more specified
    await runQuery(
      `INSERT INTO file_errors (ID, ENDPOINT, ERROR, DETAILS, TIMESTAMP) VALUES (NULL, ?, ?, ?, current_timestamp())`,
      [endpoint, err, errMsg]
    );

    var objToBeSent = {
      endpoint: endpoint,
      error: err,
    };
    if (errMsg.length > 0) objToBeSent.details = errMsg;
    if (!objToBeSent.endpoint.startsWith("/"))
      objToBeSent.endpoint = "/" + objToBeSent.endpoint;

    await sendmail(
      toHTMLTableString(objToBeSent),
      0,
      "File processing error",
      true
    );

    res = closeRequest(res, httpCode, message);
    return Promise.resolve(res);
  },

  database: async (endpoint, options, dbError, errMsg, res) => {
    /* if (process.env.DEV) return // when in DEV mode, logging is not needed */
    var message = errMsg || "Database Error",
      causedFbId = options.secretFbId,
      httpCode = 400; // not more specified

    switch (dbError.code) {
      case "ER_ROW_IS_REFERENCED_2":
        message = "Constraint violated";
        httpCode = 424;
        break;
      case "ER_DUP_ENTRY":
        message = "Primary key or index violated";
        httpCode = 409;
        break;
    }

    delete options.idtoken;
    delete options.secretFbId;
    await runQuery(
      `INSERT INTO database_errors (ID, ENDPOINT, CAUSED_BY, OPTIONS, DB_ERR, DETAILS, TIMESTAMP) VALUES 
			(NULL, ?, (SELECT ID FROM users WHERE FB_ID = ?), ?, ?, ?, current_timestamp())`,
      [endpoint, causedFbId, JSON.stringify(options), dbError, errMsg],
      'err'
    );

    var objToBeSent = {
      endpoint: endpoint,
      causedFbId: causedFbId,
      options: JSON.stringify(options),
      error: dbError,
    };
    if (errMsg.length > 0) objToBeSent.details = errMsg;

    await sendmail(toHTMLTableString(objToBeSent), 0, "Database error", true);

    res = closeRequest(res, httpCode, message);
    return Promise.resolve(res);
  },

  isDuplicateEntry: (dbErr) => {
    return dbErr.code == "ER_DUP_ENTRY";
  },

  isConstraintViolated: (dbErr) => {
    return dbErr.code == "ER_ROW_IS_REFERENCED_2";
  },
};
