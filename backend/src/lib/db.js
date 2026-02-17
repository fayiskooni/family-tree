import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

const connectDB = async () => {
  try {
    // Neon HTTP client doesn't need a persistent connection, 
    // but we can do a simple query to verify the URL
    await sql`SELECT 1`;
    console.log("Neon PostgreSQL connected via HTTP");
  } catch (err) {
    console.error("Failed to connect to Neon:", err);
  }
};

export default connectDB;
export { sql as client }; // Temporary alias for migration
