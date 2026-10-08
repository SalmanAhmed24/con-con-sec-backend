const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const serviceToolsSchema = new mongoose.Schema({
  category: { type: String },
  status: { type: String },
  description: { type: String },
  techAssigned: { type: String },
  location: { type: String },
  subCategory: { type: String },
  employee: { type: String },
  project: { type: String },
  lastPurchasePrice: { type: String },
  purchaseDate: { type: String },
  warrantyExpDate: { type: String },
  picture: {
    fileUrl: { type: String },
    filename: { type: String },
  },
  serial: { type: String },
  toolNumber: { type: String },
  parts: [
    {
      partNo: { type: String },
      description: { type: String },
    },
  ],
  attachments: [
    {
      files: [
        {
          fileUrl: { type: String },
          filename: { type: String },
        },
      ],
      user: { type: String },
      date: { type: String },
      time: { type: String },
      note: { type: String },
    },
  ],
  history: [
    {
      job: { type: String },
      file: { fileUrl: { type: String }, filename: { type: String } },
      techAssigned: { type: String },
      toolNumber: { type: String },
      date: { type: String },
      time: { type: String },
      user: { type: String },
      note: { type: String },
      checkedOut: { type: String },
    },
  ],
});
serviceToolsSchema.plugin(validator);

module.exports = mongoose.model("serviceTools", serviceToolsSchema);
