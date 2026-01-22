const express = require("express");
const router = express.Router();
const Biometric = require("../models/Biometric"); // we'll create this model

// GET all biometric details
router.get("/", async (req, res) => {
  try {
    const data = await Biometric.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
