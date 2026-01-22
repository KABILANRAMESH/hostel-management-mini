const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes"); // ⬅️ Add this line
const roomRoutes = require("./routes/roomRoutes");
const queryRoutes = require("./routes/queryRoutes");
const contactsRoute = require("./routes/contacts");
const laundryRoute = require("./routes/laundry");
app.use("/api/queries", queryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes); 
app.use("/api/rooms", roomRoutes);
app.use("/api/contacts", contactsRoute);
app.use("/api/laundry", laundryRoute);
app.use("/api/biometric", require("./routes/biometric"));


// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Hostel Maintenance Portal backend is running!");
});
// ✅ Serve frontend in production (ONE LINK)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend/build", "index.html")
    );
  });
}


// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
