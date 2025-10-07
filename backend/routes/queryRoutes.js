const express = require("express");
const router = express.Router();
const Query = require("../models/Query");

// Submit a new query
router.post("/", async (req, res) => {
  try {
    const { userId, name, roll, issueType, message } = req.body;

    if (!name || !roll || !issueType || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuery = new Query({
      userId,
      name,
      roll,
      issueType,
      message,
    });

    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all queries
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedQuery = await Query.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedQuery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
