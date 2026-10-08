const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolHistorySchema = new mongoose.Schema({
  toolNumber: { type: String },
  serial: { type: String },
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
  checkedOut: { type: String, default: "" },
  employee: { type: String },
  project: { type: String, default: "" },
  lastPurchasePrice: { type: String },
  purchaseDate: { type: Date },
  warrantyExpDate: { type: Date },
  toolTrackDate: { type: Date },
  toolTrackTime: { type: String },
  checkedOut: { type: Number, default: 30 },
  daysLeft: { type: Number },
  dueDate: { type: Date },
  lastUpdated: { type: Date },
  picture: {
    fileUrl: { type: String },
    filename: { type: String },
  },
});

module.exports = mongoose.model("toolHistory", toolHistorySchema);
