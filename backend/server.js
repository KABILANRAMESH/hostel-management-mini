const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://hostel-management-frontend-cnsv.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/laundry", require("./routes/laundry"));
app.use("/api/biometric", require("./routes/biometric"));

// Health check
app.get("/", (req, res) => {
  res.send("Hostel Backend API is running 🚀");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});