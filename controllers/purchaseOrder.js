// const purchaseOrderModel = require("../models/purchaseOrder");
// const addPurchaseOrder = async (req, res, next) => {
//   const { purchaseType, vendor, vendorSales, PO, purchaseStatus, notes } =
//     req.body;
//   const createpurchaseOrderModel = new purchaseOrderModel({
//     purchaseType,
//     vendor,
//     vendorSales,
//     PO,
//     purchaseStatus,
//     notes,
//   });
//   try {
//     await createpurchaseOrderModel.save();
//   } catch (error) {
//     res.json({ message: "Error adding User Type", error: true });
//     return next(error);
//   }
//   res.json({ message: "Created Successfully", error: false });
// };
// const getPurchaseOrder = async (req, res, next) => {
//   let purchaseOrders;
//   try {
//     purchaseOrders = await purchaseOrderModel.find({});
//   } catch (error) {
//     res.json({ message: "Error finding Purchase Order list", error: true });
//     return next(error);
//   }
//   res.json({
//     purchaseOrders: purchaseOrders.map((item) =>
//       item.toObject({ getters: true })
//     ),
//     error: false,
//   });
// };
// const editPurchaseOrder = async (req, res, next) => {
//   const { purchaseType, vendor, vendorSales, PO, purchaseStatus, notes } =
//     req.body;
//   const { purchaseId } = req.params;
//   let purchaseToBeEdited;
//   try {
//     purchaseToBeEdited = await purchaseOrderModel.findById(purchaseId);
//   } catch (error) {
//     res.json({ message: "Could not find the Purchase Order", error: true });
//     return next(error);
//   }
//   purchaseToBeEdited.purchaseType = purchaseType;
//   purchaseToBeEdited.vendor = vendor;
//   purchaseToBeEdited.vendorSales = vendorSales;
//   purchaseToBeEdited.PO = PO;
//   purchaseToBeEdited.purchaseStatus = purchaseStatus;
//   purchaseToBeEdited.notes = notes;
//   try {
//     await purchaseToBeEdited.save();
//   } catch (error) {
//     res.json({ message: "Enable to edit Purchase Order", error: true });
//     return next(error);
//   }
//   res.status(201).json({ message: "Edited successfully", error: false });
// };
// const deletePurchaseOrder = async (req, res, next) => {
//   const { purchaseId } = req.params;
//   try {
//     await purchaseOrderModel.findByIdAndRemove(purchaseId);
//   } catch (error) {
//     res.json({
//       message: "Could not found the specific Purchase Order",
//       error: true,
//     });
//     return next(error);
//   }
//   res.status(201).json({ message: "Deleted successfully", error: false });
// };
// exports.addPurchaseOrder = addPurchaseOrder;
// exports.getPurchaseOrder = getPurchaseOrder;
// exports.editPurchaseOrder = editPurchaseOrder;
// exports.deletePurchaseOrder = deletePurchaseOrder;
const purchaseOrderModel = require("../models/purchaseOrder");
const addPurchaseOrder = async (req, res, next) => {
  const {
    POId,
    jobNumber,
    jobName,
    projectManager,
    purchaseOrder,
    supplier,
    salesRep,
    salesContact,
    items,
  } = req.body;
  const createpurchaseOrderModel = new purchaseOrderModel({
    POId,
    jobNumber,
    jobName,
    projectManager,
    purchaseOrder,
    supplier,
    salesRep,
    salesContact,
    items,
  });
  try {
    await createpurchaseOrderModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getPurchaseOrder = async (req, res, next) => {
  let purchaseOrders;
  try {
    purchaseOrders = await purchaseOrderModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Purchase Order list", error: true });
    return next(error);
  }
  res.json({
    purchaseOrders: purchaseOrders.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editPurchaseOrder = async (req, res, next) => {
  const {
    POId,
    jobNumber,
    jobName,
    projectManager,
    purchaseOrder,
    supplier,
    salesRep,
    salesContact,
    items,
  } = req.body;
  const { purchaseId } = req.params;
  let purchaseToBeEdited;
  try {
    purchaseToBeEdited = await purchaseOrderModel.findById(purchaseId);
  } catch (error) {
    res.json({ message: "Could not find the Purchase Order", error: true });
    return next(error);
  }
  purchaseToBeEdited.POId = POId;
  purchaseToBeEdited.jobNumber = jobNumber;
  purchaseToBeEdited.jobName = jobName;
  purchaseToBeEdited.projectManager = projectManager;
  purchaseToBeEdited.purchaseOrder = purchaseOrder;
  purchaseToBeEdited.supplier = supplier;
  purchaseToBeEdited.salesRep = salesRep;
  purchaseToBeEdited.salesContact = salesContact;
  purchaseToBeEdited.projectManager = projectManager;
  purchaseToBeEdited.items = items;
  try {
    await purchaseToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Purchase Order", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletePurchaseOrder = async (req, res, next) => {
  const { purchaseId } = req.params;
  try {
    await purchaseOrderModel.findByIdAndRemove(purchaseId);
  } catch (error) {
    res.json({
      message: "Could not found the specific Purchase Order",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addPurchaseOrder = addPurchaseOrder;
exports.getPurchaseOrder = getPurchaseOrder;
exports.editPurchaseOrder = editPurchaseOrder;
exports.deletePurchaseOrder = deletePurchaseOrder;
