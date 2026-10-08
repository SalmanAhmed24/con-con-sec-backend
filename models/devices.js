const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const devicesSchema = new mongoose.Schema({
  category: { type: String },
  billingAccount: { type: String },
  phoneNo: { type: String },
  username: { type: String },
  make: { type: String },
  upgradeDate: { type: String },
  usageLastMonth: { type: String },
});
module.exports = mongoose.model("devices", devicesSchema);
