const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const jobPMSchema = new mongoose.Schema({
  name: { type: String },
  shortCode: { type: String },
});
module.exports = mongoose.model("jobPMs", jobPMSchema);
