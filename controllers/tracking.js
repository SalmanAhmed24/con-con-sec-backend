const trackingModel = require("../models/tracking");
const addTracking = async (req, res, next) => {
  const {
    jobNumber,
    jobName,
    location,
    dateOrdered,
    supplier,
    rep,
    contact,
    email,
    itemDescription,
    price,
    qtyOrdered,
    qtyReceived,
    estShippedDate,
    shippedDate,
    receivedDate,
    receiver,
    currentLocationStorageId,
    currentLocationBuilding,
    dateSentToJobSite,
    shippingCost,
    backOrderShippingQty,
    backOrderShipping,
    totalShipping,
    preTaxMaterialCost,
    totalCost,
  } = req.body;
  const createtrackingModel = new trackingModel({
    jobNumber,
    jobName,
    location,
    dateOrdered,
    supplier,
    rep,
    contact,
    email,
    itemDescription,
    price,
    qtyOrdered,
    qtyReceived,
    estShippedDate,
    shippedDate,
    receivedDate,
    receiver,
    currentLocationStorageId,
    currentLocationBuilding,
    dateSentToJobSite,
    shippingCost,
    backOrderShippingQty,
    backOrderShipping,
    totalShipping,
    preTaxMaterialCost,
    totalCost,
  });
  try {
    await createtrackingModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTracking = async (req, res, next) => {
  let trackings;
  try {
    trackings = await trackingModel.find({});
  } catch (error) {
    res.json({ message: "Error finding tracking list", error: true });
    return next(error);
  }
  res.json({
    trackings: trackings.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editTracking = async (req, res, next) => {
  const {
    jobNumber,
    jobName,
    location,
    dateOrdered,
    supplier,
    rep,
    contact,
    email,
    itemDescription,
    price,
    qtyOrdered,
    qtyReceived,
    estShippedDate,
    shippedDate,
    receivedDate,
    receiver,
    currentLocationStorageId,
    currentLocationBuilding,
    dateSentToJobSite,
    shippingCost,
    backOrderShippingQty,
    backOrderShipping,
    totalShipping,
    preTaxMaterialCost,
    totalCost,
  } = req.body;
  const { trackingId } = req.params;
  let trackingToBeEdited;
  try {
    trackingToBeEdited = await trackingModel.findById(trackingId);
  } catch (error) {
    res.json({ message: "Could not find the tracking", error: true });
    return next(error);
  }
  trackingToBeEdited.jobNumber = jobNumber;
  trackingToBeEdited.jobName = jobName;
  trackingToBeEdited.location = location;
  trackingToBeEdited.dateOrdered = dateOrdered;
  trackingToBeEdited.supplier = supplier;
  trackingToBeEdited.rep = rep;
  trackingToBeEdited.contact = contact;
  trackingToBeEdited.email = email;
  trackingToBeEdited.itemDescription = itemDescription;
  trackingToBeEdited.price = price;
  trackingToBeEdited.qtyOrdered = qtyOrdered;
  trackingToBeEdited.qtyReceived = qtyReceived;
  trackingToBeEdited.estShippedDate = estShippedDate;
  trackingToBeEdited.shippedDate = shippedDate;
  trackingToBeEdited.receivedDate = receivedDate;
  trackingToBeEdited.receiver = receiver;
  trackingToBeEdited.currentLocationStorageId = currentLocationStorageId;
  trackingToBeEdited.currentLocationBuilding = currentLocationBuilding;
  trackingToBeEdited.dateSentToJobSite = dateSentToJobSite;
  (trackingToBeEdited.shippingCost = shippingCost),
    (trackingToBeEdited.backOrderShippingQty = backOrderShippingQty),
    (trackingToBeEdited.backOrderShipping = backOrderShipping);
  trackingToBeEdited.totalShipping = totalShipping;
  trackingToBeEdited.preTaxMaterialCost = preTaxMaterialCost;
  trackingToBeEdited.totalCost = totalCost;
  try {
    await trackingToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tracking", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTracking = async (req, res, next) => {
  const { trackingId } = req.params;
  try {
    await trackingModel.findByIdAndRemove(trackingId);
  } catch (error) {
    res.json({ message: "Could not found the specific tracking", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addTracking = addTracking;
exports.getTracking = getTracking;
exports.editTracking = editTracking;
exports.deleteTracking = deleteTracking;
