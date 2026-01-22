const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    name: { type: String, required: true },
    roll: { type: String, required: true },
    issueType: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema); // ✅ Important
