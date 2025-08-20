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
      const { startDate, endDate } = req.query;
      const baseFilter =
        req.user.role === "commander" ? { base: req.user.base } : {};
      const assets = await Asset.find(baseFilter);

      const summary = await Promise.all(
        assets.map(async (asset) => {
          const allMovements = await Movement.find({ asset: asset._id });

          // Calculate opening balance
          const openingMovements = startDate
            ? allMovements.filter((m) => new Date(m.date) < new Date(startDate))
            : [];
          const opening = openingMovements.reduce((acc, m) => {
            if (["purchase", "transfer_in"].includes(m.type)) {
              return acc + m.quantity;
            }
            if (
              ["transfer_out", "assignment", "expenditure"].includes(m.type)
            ) {
              return acc - m.quantity;
            }
            return acc;
          }, 0);

          // Filter movements for the selected period
          const periodMovements = allMovements.filter((m) => {
            const moveDate = new Date(m.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            if (start && end) return moveDate >= start && moveDate <= end;
            if (start) return moveDate >= start;
            if (end) return moveDate <= end;
            return true; // No date filter
          });

          const purchased = periodMovements
            .filter((m) => m.type === "purchase")
            .reduce((a, b) => a + b.quantity, 0);
          const transferIn = periodMovements
            .filter((m) => m.type === "transfer_in")
            .reduce((a, b) => a + b.quantity, 0);
          const transferOut = periodMovements
            .filter((m) => m.type === "transfer_out")
            .reduce((a, b) => a + b.quantity, 0);
          const assigned = periodMovements
            .filter((m) => m.type === "assignment")
            .reduce((a, b) => a + b.quantity, 0);
          const expended = periodMovements
            .filter((m) => m.type === "expenditure")
            .reduce((a, b) => a + b.quantity, 0);

          const netMovement = purchased + transferIn - transferOut;
          const closing = opening + netMovement - assigned - expended;

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
            netMovement,
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
