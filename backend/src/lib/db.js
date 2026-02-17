import pg from "pg";
import "dotenv/config";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await client.connect();
    isConnected = true;
    console.log("Connected to Neon PostgreSQL database");
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }
};

export default connectDB;
export { client }; // Export the client instance
