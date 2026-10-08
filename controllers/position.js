const positionModel = require("../models/positionModel");
const addposition = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createpositionModel = new positionModel({
    name,
    shortCode,
  });
  try {
    await createpositionModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getposition = async (req, res, next) => {
  let positions;
  try {
    positions = await positionModel.find({});
  } catch (error) {
    res.json({ message: "Error finding position list", error: true });
    return next(error);
  }
  res.json({
    positions: positions.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editposition = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { positionId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await positionModel.findById(positionId);
  } catch (error) {
    res.json({ message: "Could not find the position", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit position", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteposition = async (req, res, next) => {
  const { positionId } = req.params;
  try {
    await positionModel.findByIdAndRemove(positionId);
  } catch (error) {
    res.json({ message: "Could not found the specific position", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addposition = addposition;
exports.getposition = getposition;
exports.editposition = editposition;
exports.deleteposition = deleteposition;
