const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const storageLocationSchema = new mongoose.Schema({
  building: { type: String },
  storageId: { type: String },
  notes: { type: String },
  description: { type: String },
});
module.exports = mongoose.model("storageLocations", storageLocationSchema);
