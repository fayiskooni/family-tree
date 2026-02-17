import jwt from "jsonwebtoken";
import { client } from "../lib/db.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Use correct env var name
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const email = decoded.email;
    const userResult = await client`SELECT * FROM users WHERE email = ${email}`;
    if (!userResult.length) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = userResult[0];

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", {
      message: error.message,
      stack: error.stack,
      cookies: !!req.cookies?.jwt
    });
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
