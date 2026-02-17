import pg from "pg";
import "dotenv/config";

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

let isConnected = false;
const connectDB = async () => {
  // If we're already connected, don't do anything
  if (isConnected && client._connected) return;
  
  try {
    // If there's an old connection that's broken, end it gracefully
    if (client._connected) await client.end().catch(() => {});
    
    await client.connect();
    isConnected = true;
    console.log("Connected to Neon PostgreSQL database");
  } catch (err) {
    console.error("Failed to connect to database:", err);
    isConnected = false;
  }
};

export default connectDB;
export { client }; // Export the client instance
