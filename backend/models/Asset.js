const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["vehicle", "weapon", "ammo"], required: true },
  quantity: { type: Number, default: 0 },
  base: { type: mongoose.Schema.Types.ObjectId, ref: "Base", required: true },
});

module.exports = mongoose.model("Asset", assetSchema);
