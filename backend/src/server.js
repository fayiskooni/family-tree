import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import familyRoutes from "./routes/family.route.js";
import familyMemberRoutes from "./routes/familyMember.route.js";
import membersRoutes from "./routes/members.route.js";
import coupleRoutes from "./routes/couple.route.js";
import parentChildRoutes from "./routes/parentChild.route.js";

import connectDB from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: true, // Allow all for easier Vercel deployment
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/auth", familyRoutes);
app.use("/api/auth", familyMemberRoutes);
app.use("/api/auth", membersRoutes);
app.use("/api/auth", coupleRoutes);
app.use("/api/auth", parentChildRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Database connection pool setup
connectDB();

if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
  const frontendPath = path.resolve(process.cwd(), "public");
  app.use(express.static(frontendPath));
  
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

if (process.env.VERCEL !== "1") {
  app.listen(PORT || 5001, () => {
    console.log(`Server running on port ${PORT || 5001}`);
  });
}

export default app;
