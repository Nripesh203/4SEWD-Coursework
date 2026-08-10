import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role === "ADMIN" ? "ADMIN" : "USER";

    const result = db
      .prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)")
      .run(username.trim(), hashedPassword, userRole);

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: result.lastInsertRowid,
        username: username.trim(),
        role: userRole,
      },
    });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username.trim());

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "User logged in successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
