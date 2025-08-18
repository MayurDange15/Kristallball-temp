const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const Movement = require("../models/Movement");
const Base = require("../models/Base");
const { protect } = require("../middleware/auth");

// Transfer asset between bases
router.post("/", protect(["admin", "logistics"]), async (req, res) => {
  const { assetId, quantity, fromBase, toBase } = req.body;

  try {
    const assetFrom = await Asset.findOne({ _id: assetId, base: fromBase });
    if (!assetFrom || assetFrom.quantity < quantity)
      return res.status(400).json({ message: "Not enough asset to transfer" });

    // deduct from source
    assetFrom.quantity -= quantity;
    await assetFrom.save();

    // add to destination
    let assetTo = await Asset.findOne({ name: assetFrom.name, base: toBase });
    if (!assetTo) {
      assetTo = await Asset.create({
        name: assetFrom.name,
        type: assetFrom.type,
        quantity,
        base: toBase,
      });
    } else {
      assetTo.quantity += quantity;
      await assetTo.save();
    }

    // log movements
    await Movement.create([
      {
        asset: assetFrom._id,
        type: "transfer_out",
        quantity,
        fromBase,
        toBase,
        createdBy: req.user.id,
      },
      {
        asset: assetTo._id,
        type: "transfer_in",
        quantity,
        fromBase,
        toBase,
        createdBy: req.user.id,
      },
    ]);

    res.json({ message: "Transfer successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// View transfer history
router.get("/", protect(["admin", "logistics"]), async (req, res) => {
  try {
    const transfers = await Movement.find({
      type: { $in: ["transfer_in", "transfer_out"] },
    }).populate("asset fromBase toBase createdBy");
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
