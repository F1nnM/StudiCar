const mariadb = require("mariadb"),
  pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 5,
    multipleStatements: true,
    charset: "utf8"
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
