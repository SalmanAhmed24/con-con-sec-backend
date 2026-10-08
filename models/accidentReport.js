const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const accidentReportSchema = new mongoose.Schema({
  employee: { type: String },
  jobTitle: { type: String },
  date: { type: String },
  time: { type: String },
  supervisor: { type: String },
  witness: { type: String },
  briefDescription: { type: String },
  bodyPartsAffected: { type: String },
  doctor: { type: Boolean },
  compensationForm: { type: Boolean },
  leftShift: { type: Boolean },
  leftDate: { type: String },
  leftTime: { type: String },
  supervisorComments: { type: String },
  preventAccident: { type: String },
  unsafeConditions: { type: Boolean },
  unsafeConditionsComments: { type: String },
  supervisorSignature: { type: String },
  mainDate: { type: String },
  phone: { type: String },
  additionalComments: { type: String },
});
module.exports = mongoose.model("accidentReports", accidentReportSchema);
