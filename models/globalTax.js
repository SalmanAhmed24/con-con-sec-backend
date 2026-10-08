const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const globalTaxSchema = new mongoose.Schema({
  taxValue: { type: Number, default: 0 },
});
module.exports = mongoose.model("globalTaxs", globalTaxSchema);
