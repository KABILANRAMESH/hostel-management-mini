const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  floor: { type: String, required: true },
  warden: {
    name: String,
    phone: String,
  },
  caretaker: {
    name: String,
    phone: String,
  },
  electrical: {
    name: String,
    phone: String,
  },
  plumber: {
    name: String,
    phone: String,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
