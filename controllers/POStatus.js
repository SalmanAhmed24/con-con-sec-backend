const POStatusModel = require("../models/POStatus");
const addPOStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createPOStatusModel = new POStatusModel({
    name,
    shortCode,
  });
  try {
    await createPOStatusModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getPOStatus = async (req, res, next) => {
  let POStatuss;
  try {
    POStatus = await POStatusModel.find({});
  } catch (error) {
    res.json({ message: "Error finding PO status list", error: true });
    return next(error);
  }
  res.json({
    POStatus: POStatus.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editPOStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { POStatusId } = req.params;
  let POStatusToBeEdited;
  try {
    POStatusToBeEdited = await POStatusModel.findById(POStatusId);
  } catch (error) {
    res.json({ message: "Could not find the PO status", error: true });
    return next(error);
  }
  POStatusToBeEdited.name = name;
  POStatusToBeEdited.shortCode = shortCode;
  try {
    await POStatusToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit PO status", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletePOStatus = async (req, res, next) => {
  const { POStatusId } = req.params;
  try {
    await POStatusModel.findByIdAndRemove(POStatusId);
  } catch (error) {
    res.json({
      message: "Could not found the specific PO status",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addPOStatus = addPOStatus;
exports.getPOStatus = getPOStatus;
exports.editPOStatus = editPOStatus;
exports.deletePOStatus = deletePOStatus;
