const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  type: {
    type: String,
    enum: [
      "purchase",
      "transfer_in",
      "transfer_out",
      "assignment",
      "expenditure",
    ],
    required: true,
  },
  quantity: { type: Number, required: true },
  fromBase: { type: mongoose.Schema.Types.ObjectId, ref: "Base" }, // for transfers
  toBase: { type: mongoose.Schema.Types.ObjectId, ref: "Base" }, // for transfers
  assignedTo: { type: String }, // for assignments
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Movement", movementSchema);
