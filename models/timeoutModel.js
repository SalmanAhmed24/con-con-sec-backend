const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const timeoutSchema = new mongoose.Schema({
  dateAdded: { type: String },
  user: { type: String },
  enteredBy: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  reason: { type: String },
  jamieFlag: { type: Boolean },
  managementFlag: { type: Boolean },
  status: { type: String },
});
module.exports = mongoose.model("timeouts", timeoutSchema);
