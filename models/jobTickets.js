const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const jobTicketSchema = new mongoose.Schema({
  ticketId: { type: String },
  manualId: { type: String },
  jobNumber: { type: String },
  ticketStatus: { type: String },
  deleteFlag: { type: Boolean, default: false },
  dateOfOrder: { type: String },
  contactName: { type: String },
  email: { type: String },
  tel: { type: String },
  createdBy: { type: String },
  assignedTo: { type: String },
  startDate: { type: String },
  jobLocation: { type: String },
  assignedBy: { type: String, default: "" },
  dateArr: [
    {
      date: { type: String, default: "" },
      description: { type: String, default: "" },
      laborArr: [
        {
          employee: { type: String },
          id: { type: String },
          laborHours: { type: Number },
          date: { type: String },
        },
      ],
      materialArr: [
        {
          id: { type: String },
          materialQuantity: { type: Number },
          description: { type: String },
        },
      ],
    },
  ],

  totalLabor: { type: Number },

  payments: [
    {
      date: { type: String },
      paymentType: { type: String },
      checkNo: { type: String },
      payment: { type: Number },
      amount: { type: Number },
      remainingAmount: { type: Number },
      note: { type: String },
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
      user: { type: String },
      date: { type: String },
      time: { type: String },
      note: { type: String },
    },
  ],
  signature: {
    fileUrl: { type: String },
    filename: { type: String },
    default: {},
  },
});
module.exports = mongoose.model("jobTickets", jobTicketSchema);
