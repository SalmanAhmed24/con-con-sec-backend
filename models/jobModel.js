const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const jobSchema = new mongoose.Schema({
  jobType: { type: String },
  jobId: { type: String },
  client: { type: String },
});
module.exports = mongoose.model("jobs", jobSchema);
