const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const serviceNumberSchema = new mongoose.Schema({
  serviceNumber: { type: String },
  jobName: { type: String },
  initials: { type: String },
  generalContractor: { type: String },
  contractTM: { type: String },
  jobPM: { type: String },
  amount: { type: Number },
  PO: { type: String },
  CO: { type: String },
  percentageBilled: { type: String },
  notes: { type: String },
  projectChecklist: { type: String },
  dateCreated: { type: String },
  dateBilled: { type: String },
});
module.exports = mongoose.model("serviceNumbers", serviceNumberSchema);
