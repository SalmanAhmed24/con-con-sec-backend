const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolAttachmentSchema = new mongoose.Schema({
  toolNumber: { type: String },
  user: { type: String },
  date: { type: Date },
  time: { type: String },
  note: { type: String },
  lastUpdated: { type: Date },
  files:[{fileUrl:{type:String},filename:{type:String}}]
});
module.exports = mongoose.model("toolAttachments", toolAttachmentSchema);
