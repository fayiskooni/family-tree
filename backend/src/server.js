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

const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // allow frontend to send cookies
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  })
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
