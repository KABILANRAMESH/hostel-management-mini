const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// ✅ Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add new contact (optional)
router.post("/", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.json({ message: "✅ Contact added successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update contact for a floor
// ✅ Update contact for a floor
router.put("/:floor", async (req, res) => {
  // <-- Add this line to debug
  console.log("PUT /contacts/:floor", req.params.floor, req.body);

  try {
    const updated = await Contact.findOneAndUpdate(
      { floor: req.params.floor },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating contact:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
