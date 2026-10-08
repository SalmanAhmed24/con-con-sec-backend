const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const taskModuleSchema = new mongoose.Schema({
  currentDate: { type: String },
  user: { type: String },
  taskCategory: { type: String },
  dueDate: { type: String },
  description: { type: String },
  taskStatus: { type: String },
  adminTask: { type: Boolean, default: false },
  taskPriority: { type: String },
  jobNumber: { type: String, default: "" },
  tags: [{ tagName: { type: String } }],
  assignedTo: [
    {
      fullname: { type: String },
      email: { type: String },
    },
  ],
  attachments: [
    {
      files: [
        {
          fileUrl: { type: String },
          filename: { type: String },
        },
      ],
      date: { type: String },
      user: { type: String },
      note: { type: String },
      attachmentCategories: { type: String },
    },
  ],
  subTasks: [
    {
      currentDate: { type: String },
      user: { type: String },
      taskCategory: { type: String },
      dueDate: { type: String },
      description: { type: String },
      taskStatus: { type: String },
      assignedTo: [
        {
          fullname: { type: String },
        },
      ],
    },
  ],
  notes: [
    {
      currentDate: { type: String },
      user: { type: String },
      noteCategory: { type: String },
      dueDate: { type: String },
      description: { type: String },
      noteStatus: { type: String },
    },
  ],
  selectedModule: [{ type: String }],
  moduleArr: [{ type: Object }],
  lastUpdated: { type: String },
  updated: { type: String },
});
module.exports = mongoose.model("tasks", taskModuleSchema);
