const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const salesPersonCodeSchema = new mongoose.Schema({
  salesPersonCode: { type: String },
});
module.exports = mongoose.model("salesPersonCodes", salesPersonCodeSchema);
