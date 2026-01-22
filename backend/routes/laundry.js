const express = require("express");
const router = express.Router();
const Laundry = require("../models/Laundry");

// Get all laundries
router.get("/", async (req, res) => {
  try {
    const laundries = await Laundry.find().sort({ givenDate: -1 });
    res.json(laundries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add laundry
router.post("/add", async (req, res) => {
  try {
    const laundry = new Laundry(req.body);
    const saved = await laundry.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update laundry status
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Laundry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
