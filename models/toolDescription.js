const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolDescriptionSchema = new mongoose.Schema({
  parentCategory: { type: String },
  parentSubCategory: { type: String },
  name: { type: String },
});
module.exports = mongoose.model("toolDescription", toolDescriptionSchema);
