import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const connectDB = async () => {
  try {
    // Just a heartbeat to check connection
    const client = await pool.connect();
    console.log("Connected to Neon PostgreSQL database");
    client.release();
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }
};

export default connectDB;
export const client = pool; // Export the pool as 'client' to maintain compatibility with existing controllers

