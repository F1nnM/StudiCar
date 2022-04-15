const mariadb = require("mariadb"),
  config = require("./dbConfig"),
  pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    connectionLimit: 5,
    multipleStatements: true,
  });

module.exports = async function runQuery(sql, data, debug=null) {
  return new Promise(async (res, rej) => {
    let conn;
    let result;
    try {
      conn = await pool.getConnection();
      result = await conn.query(sql, data);
    } catch (error) {
      console.error(error)
      return rej(error);
    } finally {
      if (conn) conn.release(); // release to pool
    }
    return res({result: result });
  });
};
