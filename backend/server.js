const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/laundry", require("./routes/laundry"));
app.use("/api/biometric", require("./routes/biometric"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
app.get("/api/reset-admin", async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const User = require("./models/User");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.findOneAndUpdate(
      { email: "admin@gmail.com" },
      {
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true }
    );

    res.send("✅ Admin reset successful | email: admin@gmail.com | password: admin123");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Admin reset failed");
  }
});

// Serve frontend (MUST BE AFTER API ROUTES)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend/build", "index.html")
    );
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
