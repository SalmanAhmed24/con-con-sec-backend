const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const overstockSchema = new mongoose.Schema({
  overstockCategory: { type: String },
  itemDesc: { type: String },
  estAvail: { type: Number },
});
module.exports = mongoose.model("overstocks", overstockSchema);
