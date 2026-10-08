const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolsSchema = new mongoose.Schema({
  toolNumber: { type: String, unique: true },
  serial: { type: String },
  category: { type: String },
  projectVehicleFlag: { type: String },
  job: { type: String, default: "" },
  vehicle: { type: String, default: "" },
  status: { type: String },
  toolDescription: { type: String },
  brand: { type: String },
  techAssigned: { type: String },
  location: { type: String },
  subCategory: { type: String },
  checkedOut: { type: String, default: "" },
  employee: { type: String },
  project: { type: String, default: "" },
  lastPurchasePrice: { type: String },
  purchaseDate: { type: String },
  warrantyExpDate: { type: String },
  toolTrackDate: { type: String },
  toolTrackTime: { type: String },
  checkedOut: { type: Number, default: 30 },
  daysLeft: { type: Number },
  lastUpdated: { type: Date },
  dueDate: { type: String },
  picture: [
    {
      fileUrl: { type: String },
      filename: { type: String },
    },
  ],
});
toolsSchema.plugin(validator);

module.exports = mongoose.model("allTools", toolsSchema);
