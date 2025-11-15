const { Pool } = require("pg");
require("dotenv").config();

console.log("DB_USER =", process.env.DB_USER);
const pool = new Pool({
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

module.exports = pool;
