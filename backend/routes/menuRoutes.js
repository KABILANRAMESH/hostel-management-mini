const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

// GET all menu
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET menu for a specific day
router.get("/:day", async (req, res) => {
  try {
    const menu = await Menu.findOne({ day: req.params.day });
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add/update menu
router.post("/", async (req, res) => {
  const { day, breakfast, lunch, dinner } = req.body;

  try {
    const existingMenu = await Menu.findOne({ day });
    if (existingMenu) {
      existingMenu.breakfast = breakfast;
      existingMenu.lunch = lunch;
      existingMenu.dinner = dinner;
      await existingMenu.save();
      return res.json(existingMenu);
    }

    const newMenu = new Menu({ day, breakfast, lunch, dinner });
    await newMenu.save();
    res.json(newMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
