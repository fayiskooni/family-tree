import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import familyRoutes from "./routes/family.route.js"
import membersRoutes from "./routes/members.route.js"

import connectDB from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/auth", familyRoutes);
app.use("/api/auth", membersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port${PORT}`);
  connectDB();
});
