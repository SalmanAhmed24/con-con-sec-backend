const buildingModel = require("../models/building");
const addBuilding = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createBuildingModel = new buildingModel({
    name,
    shortCode,
  });
  try {
    await createBuildingModel.save();
  } catch (error) {
    res.json({ message: "Error adding Building", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getBuilding = async (req, res, next) => {
  let buildings;
  try {
    buildings = await buildingModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Building list", error: true });
    return next(error);
  }
  res.json({
    buildings: buildings.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editBuilding = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { buildingId } = req.params;
  let buildingToBeEdited;
  try {
    buildingToBeEdited = await buildingModel.findById(buildingId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  buildingToBeEdited.name = name;
  buildingToBeEdited.shortCode = shortCode;
  try {
    await buildingToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteBuilding = async (req, res, next) => {
  const { buildingId } = req.params;
  try {
    await buildingModel.findByIdAndRemove(buildingId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addBuilding = addBuilding;
exports.getBuilding = getBuilding;
exports.editBuilding = editBuilding;
exports.deleteBuilding = deleteBuilding;
