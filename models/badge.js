const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const badgeSchema = new mongoose.Schema({
  badge: { type: String },
  badgeStatus: { type: String },
  badgeType: { type: String },
  employee: { type: String },
  phone: { type: String },
  email: { type: String },
  dateIssued: { type: String },
  sponsored: { type: String },
  generalContractor: { type: String,default:"" },
  escorting: { type: String },
  expDate: { type: Date },
  attachments: [
    {
      files: [
        {
          fileUrl: { type: String },
          filename: { type: String },
        },
      ],
      user: { type: String },
      date: { type: String },
      time: { type: String },
      note: { type: String },
    },
  ],
});
module.exports = mongoose.model("badges", badgeSchema);
