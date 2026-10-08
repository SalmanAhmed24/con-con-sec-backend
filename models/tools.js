const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolsSchema = new mongoose.Schema({
  category: { type: String },
  projectVehicleFlag: { type: String },
  job: { type: String, default: "" },
  vehicle: { type: String, default: "" },
  status: { type: String },
  toolDescription: { type: String },
  description: { type: String },
  brand: { type: String },
  techAssigned: { type: String },
  location: { type: String },
  subCategory: { type: String },
  employee: { type: String },
  project: { type: String, default: "" },
  lastPurchasePrice: { type: String },
  purchaseDate: { type: String },
  warrantyExpDate: { type: String },
  toolTrackDate: { type: Date },
  toolTrackTime: { type: String },
  checkedOut: { type: String },
  picture: {
    fileUrl: { type: String },
    filename: { type: String },
  },
  serial: { type: String },
  toolNumber: { type: String, unique: true },
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
toolsSchema.plugin(validator);

module.exports = mongoose.model("tools", toolsSchema);
