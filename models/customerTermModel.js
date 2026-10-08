const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const customerTermSchema = new mongoose.Schema({
  days: { type: String },
  description: { type: String },
});
module.exports = mongoose.model("customerTerm", customerTermSchema);
