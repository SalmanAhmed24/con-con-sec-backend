const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const vehicleSchema = new mongoose.Schema({
  vehicleNo: { type: String },
  status: { type: String },
  enterpriseId: { type: String },
  email: { type: String },
  driverWEXPin: { type: String },
  vinNo: { type: String },
  tagExperation: { type: String },
  licensePlate: { type: String },
  makeModel: { type: String },
  color: { type: String },
  year: { type: String },
  txTag: { type: String },
  gasCard: { type: String },
  gasCardLast: { type: String },
  cardNo: { type: String },
  trackingInstalled: { type: String },
  geoTab: { type: String },
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
      attachmentCategories: { type: String },
    },
  ],
});
module.exports = mongoose.model("vehicles", vehicleSchema);
