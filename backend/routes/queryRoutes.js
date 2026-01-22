const express = require("express");
const router = express.Router();
const Query = require("../models/Query");

// -------------------- Add new query --------------------
router.post("/add", async (req, res) => {
  try {
    const { userId, name, roll, issueType, message } = req.body;

    if (!name?.trim() || !roll?.trim() || !issueType?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuery = new Query({
      userId: userId || null,
      name: name.trim(),
      roll: roll.trim(),
      issueType: issueType.trim(),
      message: message.trim(),
      status: "Pending",
    });

    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (err) {
    console.error("❌ Error adding query:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- GET all queries --------------------
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error("❌ Error fetching queries:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// -------------------- Update query status --------------------
// routes/queryRoutes.js
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body; // accept feedback

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true }
    );

    if (!updatedQuery) return res.status(404).json({ error: "Query not found" });

    res.json(updatedQuery);
  } catch (err) {
    console.error("❌ Error updating query:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
