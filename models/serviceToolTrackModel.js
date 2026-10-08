const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const servcieToolTrackSchema = new mongoose.Schema({
  job: { type: String },
  file: { fileUrl: { type: String }, filename: { type: String } },
  techAssigned: { type: String },
  toolNumber: { type: String },
  date: { type: String },
  time: { type: String },
  user: { type: String },
  note: { type: String },
  checkedOut: { type: String },
  location: { type: String },
});

module.exports = mongoose.model("serviceToolsTrack", servcieToolTrackSchema);
