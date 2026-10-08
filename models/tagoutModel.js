const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const tagoutModuleSchema = new mongoose.Schema({
  currentDate: { type: String },
  user: { type: String },
  tagNumber: { type: String },
  equipmentName: { type: String },
  equipmentLocation: { type: String },
  name: { type: String },
  phone: { type: String },
  dateApplied: { type: String },
  releasedDate: { type: String },
  releasedInitials: { type: String },
});
module.exports = mongoose.model("tagouts", tagoutModuleSchema);
