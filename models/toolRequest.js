const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolRequestSchema = new mongoose.Schema({
  date: { type: String },
  time: { type: String },
  user: { type: String },
  toolRequest: { type: String },
  projectVehicleFlag: { type: String },
  noOfDays: { type: String },
  dateNeededBy: { type: String },
  projectDescription: { type: String, default: "" },
  vehicleDescription: { type: String, default: "" },
  approval: { type: "String", default: "Pending" },
  assignedTo: { type: "String" },
  deliverTo: { type: "String", default: "" },
  toolNumber: { type: "String", default: "" },
});
module.exports = mongoose.model("toolRequests", toolRequestSchema);
