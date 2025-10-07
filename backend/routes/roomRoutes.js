const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// GET all rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// POST add room
router.post("/", async (req, res) => {
  const room = new Room(req.body);
  await room.save();
  res.json(room);
});

// PUT update room
router.put("/:id", async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(room);
});

module.exports = router;
