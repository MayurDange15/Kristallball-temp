const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const Movement = require("../models/Movement");
const { protect } = require("../middleware/auth");

// Get summary per base
router.get(
  "/",
  protect(["admin", "commander", "logistics"]),
  async (req, res) => {
    try {
      const baseFilter =
        req.user.role === "commander" ? { base: req.user.base } : {};
      const assets = await Asset.find(baseFilter);

      const summary = await Promise.all(
        assets.map(async (asset) => {
          const movements = await Movement.find({ asset: asset._id });
          const opening = 0; // assume 0 for simplicity
          const purchased = movements
            .filter((m) => m.type === "purchase")
            .reduce((a, b) => a + b.quantity, 0);
          const transferIn = movements
            .filter((m) => m.type === "transfer_in")
            .reduce((a, b) => a + b.quantity, 0);
          const transferOut = movements
            .filter((m) => m.type === "transfer_out")
            .reduce((a, b) => a + b.quantity, 0);
          const assigned = movements
            .filter((m) => m.type === "assignment")
            .reduce((a, b) => a + b.quantity, 0);
          const expended = movements
            .filter((m) => m.type === "expenditure")
            .reduce((a, b) => a + b.quantity, 0);
          const closing = asset.quantity;

          return {
            asset: asset.name,
            type: asset.type,
            opening,
            purchased,
            transferIn,
            transferOut,
            assigned,
            expended,
            closing,
            netMovement: purchased + transferIn - transferOut,
          };
        })
      );

      res.json(summary);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
