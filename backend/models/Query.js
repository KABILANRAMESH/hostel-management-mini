const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  roll: { type: String, required: true },         // ✅ Add Roll Number
  issueType: { type: String, required: true },   // ✅ Add Issue Type
  message: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending or Resolved
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Query", querySchema);
