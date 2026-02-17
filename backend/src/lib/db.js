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
    const client = await pool.connect();
    client.release();
  } catch (err) {
    // Silence error logs during quick lambda lifecycle unless fatal
  }
};

export default connectDB;
export const client = pool; // Export the pool as 'client' to maintain compatibility with existing controllers

