const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const subtoolCategoryTypeSchema = new mongoose.Schema({
  parentCategory: { type: String },
  name: { type: String },
});
module.exports = mongoose.model("subtoolCategory", subtoolCategoryTypeSchema);
