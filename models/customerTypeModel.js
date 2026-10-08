const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const customerTypeSchema = new mongoose.Schema({
  customerType: { type: String },
});
module.exports = mongoose.model("customerTypes", customerTypeSchema);
