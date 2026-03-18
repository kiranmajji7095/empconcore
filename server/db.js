const mysql = require("mysql2/promise");
require("dotenv").config();

console.log("DB CONFIG =>", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "(hidden)" : "(empty)",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection()
  .then(() => console.log("✅ MySQL Connected Successfully"))
  .catch(err => console.error("❌ MySQL Connection Error:", err.message));

module.exports = pool;
  