const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const writeUpSchema = new mongoose.Schema({
  dateCreated: { type: String },
  createdBy: { type: String },
  employeeName: { type: String },
  dateAdded: { type: String },
  typeOfWarning: { type: String },
  typeOfOffences: [{ type: String }],
  otherOffence: { type: String, default: "" },
  description: { type: String },
  signature: {
    fileUrl: { type: String },
    filename: { type: String },
    default: {},
  },
});
module.exports = mongoose.model("writeUps", writeUpSchema);
