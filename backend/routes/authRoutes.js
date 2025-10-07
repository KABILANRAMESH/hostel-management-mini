const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");  // Your Mongoose model

// ===============================
// ✅ REGISTER (Admin or Student)
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Check if all fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "❌ Please fill in all fields" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists with this email" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // 5️⃣ Send success response
    res.status(201).json({
      message: "✅ User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// ===============================
// ✅ LOGIN (with clear error messages)
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "❌ Please provide both email and password" });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ No user found with this email" });
    }

    // 3️⃣ Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Wrong password" });
    }

    // 4️⃣ Generate JWT token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "❌ JWT secret not set in environment" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5️⃣ Success response
    res.json({
      message: "✅ Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

module.exports = router;
