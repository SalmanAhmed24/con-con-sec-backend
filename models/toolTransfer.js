const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolTransferSchema = new mongoose.Schema({
  date: { type: Date },
  time: { type: String },
  user: { type: String },
  assignedTo: { type: Boolean, default: false },
  toolTransfer: [
    {
      toolNumber: { type: String },
      note: { type: String },
      projectVehicleFlag: { type: String },
      jobPickup: { type: String, default: "" },
      jobDestination: { type: String, default: "" },
      vehicleDestination: { type: String, default: "" },
      vehiclePickup: { type: String, default: "" },
      assignedTo: { type: String, default: "" },
      returnFlag: { type: String, default: "Pending" },
      location: { type: String, default: "" },
      checkedOut: { type: Number, default: 30 },
    },
  ],
  returnFlag: { type: String, default: "Pending" },
});
module.exports = mongoose.model("toolTransfers", toolTransferSchema);
