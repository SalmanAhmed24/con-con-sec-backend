const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolReturnsSchema = new mongoose.Schema({
  date: { type: Date },
  time: { type: String },
  user: { type: String },
  assignedTo: { type: Boolean, default: false },
  toolRequest: [
    {
      toolNumber: { type: String },
      note: { type: String },
      projectVehicleFlag: { type: String },
      vehicle: { type: String },
      jobNumber: { type: String },
      returnFlag: { type: String, default: "Pending" },
      assignedTo: { type: String, default: "" },
      location: { type: String, default: "" },
      broken: { type: Boolean, default: false },
    },
  ],
  returnFlag: { type: String, default: "Pending" },
});
module.exports = mongoose.model("toolReturns", toolReturnsSchema);
