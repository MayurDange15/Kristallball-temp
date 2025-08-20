const express = require("express");
const router = express.Router();
const Base = require("../models/Base");
const { protect } = require("../middleware/auth");

// Get all bases
router.get(
  "/",
  protect(["admin", "commander", "logistics"]),
  async (req, res) => {
    try {
      const bases = await Base.find();
      res.json(bases);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
