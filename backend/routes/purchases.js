const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const Movement = require("../models/Movement");
const Base = require("../models/Base");
const { protect } = require("../middleware/auth");

// Add purchase (Admin / Logistics)
router.post("/", protect(["admin", "logistics"]), async (req, res) => {
  const { name, type, quantity, base } = req.body;

  try {
    // find or create asset
    let asset = await Asset.findOne({ name, base });
    if (!asset) {
      asset = await Asset.create({ name, type, quantity, base });
    } else {
      asset.quantity += quantity;
      await asset.save();
    }

    // log movement
    await Movement.create({
      asset: asset._id,
      type: "purchase",
      quantity,
      toBase: base,
      createdBy: req.user.id,
    });

    res.json({ message: "Purchase recorded", asset });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View purchases with optional filters
router.get("/", protect(["admin", "logistics"]), async (req, res) => {
  const { base, type, startDate, endDate } = req.query;
  const filter = { type: "purchase" };
  if (base) filter.toBase = base;
  if (type) filter.assetType = type;
  if (startDate || endDate) filter.date = {};
  if (startDate) filter.date.$gte = new Date(startDate);
  if (endDate) filter.date.$lte = new Date(endDate);

  try {
    const purchases = await Movement.find(filter).populate(
      "asset toBase createdBy"
    );
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
