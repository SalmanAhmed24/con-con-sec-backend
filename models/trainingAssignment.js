const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const trainingAssignmentSchema = new mongoose.Schema({
  trainingCategory: { type: String },
  trainingType: { type: String },
  trainingId: { type: String },
  dateAssigned: { type: String },
  notes: { type: String },
  assignedTo: [
    {
      name: { type: String },
    },
  ],
  completedUser: [
    {
      name: { type: String },
    },
  ],
  status: { type: String, default: "Not Assigned" },
});
// trainingSchema.plugin(validator);
module.exports = mongoose.model(
  "trainingAssignments",
  trainingAssignmentSchema,
);
