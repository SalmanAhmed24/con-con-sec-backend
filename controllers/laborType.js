const laborTypeModel = require("../models/laborTypeModel");
const addLaborType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createlaborTypeModel = new laborTypeModel({
    name,
    shortCode,
  });
  try {
    await createlaborTypeModel.save();
  } catch (error) {
    res.json({ message: "Error adding Labor Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getLaborType = async (req, res, next) => {
  let laborTypes;
  try {
    laborTypes = await laborTypeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding labor Type list", error: true });
    return next(error);
  }
  res.json({
    laborTypes: laborTypes.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editLaborType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { laborTypeId } = req.params;
  let laborTypeToBeEdited;
  try {
    laborTypeToBeEdited = await laborTypeModel.findById(laborTypeId);
  } catch (error) {
    res.json({ message: "Could not find the labor Type", error: true });
    return next(error);
  }
  laborTypeToBeEdited.name = name;
  laborTypeToBeEdited.shortCode = shortCode;
  try {
    await laborTypeToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit labor Type", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteLaborType = async (req, res, next) => {
  const { laborTypeId } = req.params;
  try {
    await laborTypeModel.findByIdAndRemove(laborTypeId);
  } catch (error) {
    res.json({
      message: "Could not found the specific labor Type",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addLaborType = addLaborType;
exports.getLaborType = getLaborType;
exports.editLaborType = editLaborType;
exports.deleteLaborType = deleteLaborType;
