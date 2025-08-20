const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const Movement = require("../models/Movement");
const { protect } = require("../middleware/auth");

// Assign asset to personnel
router.post("/assign", protect(["admin", "commander"]), async (req, res) => {
  const { assetId, quantity, assignedTo } = req.body;

  try {
    const asset = await Asset.findById(assetId);
    if (!asset || asset.quantity < quantity)
      return res.status(400).json({ message: "Not enough asset to assign" });

    asset.quantity -= quantity;
    await asset.save();

    await Movement.create({
      asset: asset._id,
      type: "assignment",
      quantity,
      assignedTo,
      createdBy: req.user.id,
    });
    res.json({ message: "Asset assigned" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark asset as expended
router.post("/expend", protect(["admin", "commander"]), async (req, res) => {
  const { assetId, quantity } = req.body;

  try {
    const asset = await Asset.findById(assetId);
    if (!asset || asset.quantity < quantity)
      return res.status(400).json({ message: "Not enough asset to expend" });

    asset.quantity -= quantity;
    await asset.save();

    await Movement.create({
      asset: asset._id,
      type: "expenditure",
      quantity,
      createdBy: req.user.id,
    });
    res.json({ message: "Asset expended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assignment/expenditure history
router.get("/history", protect(["admin", "commander"]), async (req, res) => {
  try {
    const history = await Movement.find({
      type: { $in: ["assignment", "expenditure"] },
    }).populate("asset createdBy");
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
