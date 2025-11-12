const sql = require("mssql");
const dotenv = require("dotenv");

// Load .env file
dotenv.config();

// Database configuration
const dbConfig = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool; // global pool

// ✅ Get Connection (always reuse if open)
const getConnection = async () => {
  try {
    if (!pool || !pool.connected) {
      pool = await sql.connect(dbConfig);
      console.log("✅ Database connected successfully");
    }
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
};

// ✅ Close Connection (optional, mostly for tests/shutdown)
const closeConnection = async () => {
  try {
    if (pool && pool.connected) {
      await pool.close();
      console.log("🔌 Database connection closed");
    }
    pool = null;
  } catch (error) {
    console.error("❌ Error closing database connection:", error.message);
  }
};

// ✅ Test connection helper
const testConnection = async () => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT 1 AS test");
    console.log("🧪 Database test query successful:", result.recordset[0]);
    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    return false;
  }
};

// ✅ Init database on startup
const initializeDatabase = async () => {
  try {
    await getConnection();
    await testConnection();
  } catch (error) {
    console.error("💥 Database initialization failed:", error.message);
  }
};

module.exports = {
  getConnection,
  closeConnection,
  testConnection,
  initializeDatabase,
  sql,
};
