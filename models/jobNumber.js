const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
// const jobNumberSchema = new mongoose.Schema({
//   jobTag: { type: String },
//   number: { type: String },
//   jobPM: { type: String },
//   jobName: { type: String },
//   client: { type: String },
//   dateCreated: { type: String },
//   dateBilled: { type: String },
//   jobCTM: { type: String },
//   amount: { type: String },
//   POContract: { type: String },
//   changeOrder: { type: String },
//   percentageBilled: { type: String },
//   notes: { type: String },
//   generalContractor: { type: String },
// });
const jobNumberSchema = new mongoose.Schema({
  jobNumber: { type: String },
  jobName: { type: String },
  initials: { type: String },
  generalContractor: { type: String },
  contractTM: { type: String },
  jobPM: { type: String },
  amount: { type: String },
  PO: { type: String },
  CO: { type: String },
  percentageBilled: { type: String },
  notes: { type: String },
  projectChecklist: { type: String },
  dateCreated: { type: String },
  dateBilled: { type: String },
  QBW: { type: Boolean, default: false },
  PAY: { type: Boolean, default: false },
  notesMultiple: [
    {
      dateAdded: { type: Date },
      timeAdded: { type: String },
      note: { type: String },
      addedBy: { type: String },
    },
  ],
});
module.exports = mongoose.model("jobNumbers", jobNumberSchema);
