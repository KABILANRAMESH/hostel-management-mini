const mongoose = require("mongoose");

const laundrySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  givenDate: { type: Date, required: true },
  pickupDate: { type: Date, default: null }, // admin fills this
  status: { type: String, enum: ["In Progress", "Completed"], default: "In Progress" },
}, { collection: "laundries" });

module.exports = mongoose.model("Laundry", laundrySchema);
