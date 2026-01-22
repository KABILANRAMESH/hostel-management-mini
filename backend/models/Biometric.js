// models/Biometric.js
const mongoose = require("mongoose");

const BiometricSchema = new mongoose.Schema({
  rollNumber: String,
  name: String,
  timestamp: Date,
}, { collection: "biometricDetails" }); // ⚠ Make sure collection name matches your MongoDB

module.exports = mongoose.model("Biometric", BiometricSchema);
