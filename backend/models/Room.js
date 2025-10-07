const mongoose = require("mongoose");

const occupantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }
});

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Available", "Occupied"], default: "Available" },
  occupants: [occupantSchema]
});

module.exports = mongoose.model("Room", roomSchema);
