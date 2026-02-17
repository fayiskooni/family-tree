import { client } from "../lib/db.js"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 

import "dotenv/config";

const saltRounds = process.env.SALT_ROUND;
const jwtSecret = process.env.JWT_SECRET;

export async function signup(req, res) {
  const { email, password, username } = req.body;
  console.log("Signup attempt:", { email, username });

  try {
    if (!email || !password || !username) {
      console.log("Signup missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUsers = await client`SELECT * FROM users WHERE email = ${email}`;
    if (existingUsers.length > 0) {
      console.log("Signup: Email already exists", email);
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    } else {
      // Hash the password
      console.log("Hashing password with salt rounds:", saltRounds);
      const hash = await bcrypt.hash(password, Number(saltRounds) || 10);
      const result = await client`INSERT INTO users (email, password, username) VALUES (${email}, ${hash}, ${username}) RETURNING *`;
      const user = result[0];
      console.log("User created successfully:", user.email);

      // Auto-login after signup
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        jwtSecret,
        { expiresIn: "24h" }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({ success: true, token, user });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  console.log("Login attempt:", { email });

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const userResult = await client`SELECT * FROM users WHERE email = ${email}`;
    if (userResult.length === 0) {
      console.log("Login: User not found", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = userResult[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Login: Password mismatch for", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // Set token as httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, 
    });

    console.log("Login successful:", email);
    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}
