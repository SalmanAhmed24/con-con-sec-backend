const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const generalContractorSchema = new mongoose.Schema({
  companyName: { type: String },
  contact: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
});
module.exports = mongoose.model("generalContractor", generalContractorSchema);
