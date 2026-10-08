const warningModel = require("../models/warningModel");
const addWarning = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createwarningModel = new warningModel({
    name,
    shortCode,
  });
  try {
    await createwarningModel.save();
  } catch (error) {
    res.json({ message: "Error adding warning", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getWarning = async (req, res, next) => {
  let warnings;
  try {
    warnings = await warningModel.find({});
  } catch (error) {
    res.json({ message: "Error finding warning list", error: true });
    return next(error);
  }
  res.json({
    warnings: warnings.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editWarning = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { warningId } = req.params;
  let warningToBeEdited;
  try {
    warningToBeEdited = await warningModel.findById(warningId);
  } catch (error) {
    res.json({ message: "Could not find the warning", error: true });
    return next(error);
  }
  warningToBeEdited.name = name;
  warningToBeEdited.shortCode = shortCode;
  try {
    await warningToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit warning", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteWarning = async (req, res, next) => {
  const { warningId } = req.params;
  try {
    await warningModel.findByIdAndRemove(warningId);
  } catch (error) {
    res.json({
      message: "Could not found the specific warning",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addWarning = addWarning;
exports.getWarning = getWarning;
exports.editWarning = editWarning;
exports.deleteWarning = deleteWarning;
