const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolDamageSchema = new mongoose.Schema({
  user: { type: String },
  toolNumber: { type: String },
  currentDate: { type: String },
  category: { type: String },
  subCategory: { type: String },
  description: { type: String },
  location: { type: String },
  serial: { type: String },
  picture: {
    fileUrl: { type: String },
    filename: { type: String },
  },
});
module.exports = mongoose.model("toolDamage", toolDamageSchema);
