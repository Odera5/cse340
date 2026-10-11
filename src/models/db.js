
import { Pool } from "pg";

// Create a PostgreSQL connection pool.
const poolConfig = {
  connectionString: process.env.DB_URL,
};

if (process.env.DB_SSL === "true") {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

// Export a wrapped pool in development mode for SQL logging.
// In other environments, export the pool directly.
let db = null;

if (
  process.env.NODE_ENV === "development" &&
  process.env.ENABLE_SQL_LOGGING === "true"
) {
  db = {
    // Execute a query and log its details.
    async query(text, params) {
      try {
        const start = Date.now();
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        console.log("Executed query:", {
          text: text.replace(/\s+/g, " ").trim(),
          duration: `${duration}ms`,
          rows: result.rowCount,
        });

        return result;
      } catch (error) {
        console.error("Error in query:", {
          text: text.replace(/\s+/g, " ").trim(),
          error: error.message,
        });

        throw error;
      }
    },

    // Acquire a dedicated connection for transactions.
    async connect() {
      return await pool.connect();
    },

    // Close the connection pool.
    async close() {
      await pool.end();
    },
  };
} else {
  // Use the PostgreSQL pool directly outside the logging configuration.
  db = pool;
}

// Test the database connection.
const testConnection = async () => {
  try {
    const result = await db.query("SELECT NOW() as current_time");

    console.log(
      "Database connection successful:",
      result.rows[0].current_time,
    );

    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export { db as default, testConnection };
