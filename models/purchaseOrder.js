// const mongoose = require("mongoose");
// const validator = require("mongoose-unique-validator");
// const purchaseOrderSchema = new mongoose.Schema({
//   purchaseType: { type: String },
//   vendor: { type: String },
//   vendorSales: { type: String },
//   PO: { type: String },
//   purchaseStatus: { type: String },
//   notes: { type: String },
// });
// module.exports = mongoose.model("purchaseOrders", purchaseOrderSchema);

const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const purchaseOrderSchema = new mongoose.Schema({
  POId: { type: String },
  jobNumber: { type: String },
  jobName: { type: String },
  projectManager: { type: String },
  purchaseOrder: { type: String },
  supplier: { type: String },
  salesRep: { type: String },
  salesContact: { type: String },
  items: [
    {
      id: { type: String },
      number: { type: Number },
      dateOrdered: { type: String },
      quantityOrdered: { type: Number },
      partNo: { type: String },
      vendor: { type: String },
      description: { type: String },
      notes: { type: String },
    },
  ],
});
module.exports = mongoose.model("purchaseOrders", purchaseOrderSchema);
