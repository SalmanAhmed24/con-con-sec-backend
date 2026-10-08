const offenceModel = require("../models/offenceModel");
const addOffences = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createoffenceModel = new offenceModel({
    name,
    shortCode,
  });
  try {
    await createoffenceModel.save();
  } catch (error) {
    res.json({ message: "Error adding offence", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getOffences = async (req, res, next) => {
  let offences;
  try {
    offences = await offenceModel.find({});
  } catch (error) {
    res.json({ message: "Error finding offence list", error: true });
    return next(error);
  }
  res.json({
    offences: offences.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editOffences = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { offenceId } = req.params;
  let offenceToBeEdited;
  try {
    offenceToBeEdited = await offenceModel.findById(offenceId);
  } catch (error) {
    res.json({ message: "Could not find the offence", error: true });
    return next(error);
  }
  offenceToBeEdited.name = name;
  offenceToBeEdited.shortCode = shortCode;
  try {
    await offenceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit offence", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteOffences = async (req, res, next) => {
  const { offenceId } = req.params;
  try {
    await offenceModel.findByIdAndRemove(offenceId);
  } catch (error) {
    res.json({
      message: "Could not found the specific offence",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addOffences = addOffences;
exports.getOffences = getOffences;
exports.editOffences = editOffences;
exports.deleteOffences = deleteOffences;
