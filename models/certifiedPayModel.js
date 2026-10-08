const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const certifiedPaySchema = new mongoose.Schema({
  CP: { type: Boolean },
  active: { type: Boolean },
  generalContractor: { type: String },
  frequency: { type: String },
  startDate: { type: String },
  jobName: { type: String },
  jobNumber: { type: String },
  address: { type: String },
  contact: { type: String },
  deliveryMethod: { type: String },
  attachments: [
    {
      fileUrl: { type: String },
      filename: { type: String },
    },
  ],
});
module.exports = mongoose.model("certifiedPays", certifiedPaySchema);
