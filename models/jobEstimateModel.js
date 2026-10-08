const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const jobEstModuleSchema = new mongoose.Schema({
  RFQId: { type: String },
  estimateId: { type: String },
  approvalId: { type: String },
  handOffId: { type: String },
  jobId: { type: String },
  status: { type: String },
  active: { type: String },
  date: { type: String },
  source: { type: String },
  generalContractor: { type: String },
  client: { type: String },
  description: { type: String },
  dueDate: { type: String },
  contactInfo: { type: String },
  attachments: [
    {
      files: [
        {
          fileUrl: { type: String },
          filename: { type: String },
        },
      ],
    },
  ],
});
module.exports = mongoose.model("jobEstimates", jobEstModuleSchema);
