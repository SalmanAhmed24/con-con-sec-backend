const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const materialLevelSchema = new mongoose.Schema({
  materialLevel: { type: String },
});
module.exports = mongoose.model("materialLevels", materialLevelSchema);
