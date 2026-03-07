const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   Middleware
========================= */

// Allow requests from your frontend
const corsOptions = {
  origin: "https://hostel-management-frontend-cnsv.onrender.com",
  credentials: true,
};

// Enable CORS
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS)
app.options("*", cors(corsOptions));

// Parse JSON body
app.use(express.json());

/* =========================
   Routes
========================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/laundry", require("./routes/laundry"));
app.use("/api/biometric", require("./routes/biometric"));

/* =========================
   Health Check Route
========================= */

app.get("/", (req, res) => {
  res.send("Hostel Backend API is running 🚀");
});

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});