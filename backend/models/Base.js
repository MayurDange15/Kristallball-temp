const mongoose = require("mongoose");

const baseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String },
});

module.exports = mongoose.model("Base", baseSchema);
