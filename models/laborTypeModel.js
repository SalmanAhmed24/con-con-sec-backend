const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const laborTypeSchema = new mongoose.Schema({
  name: { type: String },
  shortCode: { type: String },
});
module.exports = mongoose.model("laborTypes", laborTypeSchema);
