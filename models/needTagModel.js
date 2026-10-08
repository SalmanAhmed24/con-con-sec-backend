const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const needTagSchema = new mongoose.Schema({
  user: { type: String },
  currentDate: { type: String },
  category: { type: String },
  subCategory: { type: String },
  description: { type: String },
  location: { type: String },
  serial: { type: String },
  picture: {
    fileUrl: { type: String },
    filename: { type: String },
  },
});
module.exports = mongoose.model("needTags", needTagSchema);
