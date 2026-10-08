const reimbursalTypeModel = require("../models/reimbursalTypeModel");
const addReimbursalType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createReimbursalTypeModel = new reimbursalTypeModel({
    name,
    shortCode,
  });
  try {
    await createReimbursalTypeModel.save();
  } catch (error) {
    res.json({ message: "Error adding Reimbursal Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getReimbursalsType = async (req, res, next) => {
  let reimbursalTypes;
  try {
    reimbursalTypes = await reimbursalTypeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding reimbursalType list", error: true });
    return next(error);
  }
  res.json({
    reimbursalTypes: reimbursalTypes.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editReimbursalType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { reimbursalTypeId } = req.params;
  let reimbursalToBeEdited;
  try {
    reimbursalToBeEdited = await reimbursalTypeModel.findById(reimbursalTypeId);
  } catch (error) {
    res.json({ message: "Could not find the reimbursalType", error: true });
    return next(error);
  }
  reimbursalToBeEdited.name = name;
  reimbursalToBeEdited.shortCode = shortCode;
  try {
    await reimbursalToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit reimbursalType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteReimbursalType = async (req, res, next) => {
  const { reimbursalTypeId } = req.params;
  try {
    await reimbursalTypeModel.findByIdAndRemove(reimbursalTypeId);
  } catch (error) {
    res.json({
      message: "Could not found the specific reimbursalType",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addReimbursalType = addReimbursalType;
exports.getReimbursalsType = getReimbursalsType;
exports.editReimbursalType = editReimbursalType;
exports.deleteReimbursalType = deleteReimbursalType;
