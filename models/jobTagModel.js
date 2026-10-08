const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const jobTagSchema = new mongoose.Schema({
  name: { type: String },
  shortCode: { type: String },
});
module.exports = mongoose.model("jobTags", jobTagSchema);
