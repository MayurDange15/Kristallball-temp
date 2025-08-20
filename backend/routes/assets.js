const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const { protect } = require("../middleware/auth");

// Get all assets
router.get(
  "/",
  protect(["admin", "commander", "logistics"]),
  async (req, res) => {
    try {
      const assets = await Asset.find().populate("base");
      res.json(assets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
