const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  day: String,
  breakfast: [String],
  lunch: [String],
  dinner: [String],
});

module.exports = mongoose.model("Menu", menuSchema);
