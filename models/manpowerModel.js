const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const manpowerSchema = new mongoose.Schema({
  job: { type: String },
  PM: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  shiftStartTime: { type: String },
  shiftEndTime: { type: String },
  notes: { type: String },
  requiredEmp: {
    foreman: {
      noOfEmp: { type: Number },
    },
    journeyman: { noOfEmp: { type: Number } },
    apprentice: { noOfEmp: { type: Number } },
    construction: { noOfEmp: { type: Number } },
  },
  assignedEmp: {
    foreman: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    journeyman: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    apprentice: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
    construction: { noOfEmp: { type: Number }, employees: [{ type: Object }] },
  },
});
module.exports = mongoose.model("manpowers", manpowerSchema);
