const mariadb = require('mariadb');
const config = require('./dbConfig');
const pool = mariadb.createPool({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  connectionLimit: 5
});

module.exports = async function runQuery(sql, data) {
  let conn;
  let result;
  try {
    conn = await pool.getConnection();
    result = await conn.query(sql, data);
  } catch (error) {
    throw error;
    return { error }
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return { result };
}
