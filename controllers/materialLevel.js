const materialLevelModel = require("../models/materialLevelModel");
const addmaterialLevel = async (req, res, next) => {
  const { materialLevel } = req.body;
  const creatematerialLevelModel = new materialLevelModel({
    materialLevel,
  });
  try {
    await creatematerialLevelModel.save();
  } catch (error) {
    res.json({ message: "Error adding Customer Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getmaterialLevel = async (req, res, next) => {
  let materialLevels;
  try {
    materialLevels = await materialLevelModel.find({});
  } catch (error) {
    res.json({ message: "Error finding materialLevel list", error: true });
    return next(error);
  }
  res.json({
    materialLevels: materialLevels.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editmaterialLevel = async (req, res, next) => {
  const { materialLevel } = req.body;
  const { materialLevelId } = req.params;
  let typeToBeEdited;
  try {
    typeToBeEdited = await materialLevelModel.findById(materialLevelId);
  } catch (error) {
    res.json({ message: "Could not find the materialLevel", error: true });
    return next(error);
  }
  typeToBeEdited.materialLevel = materialLevel;
  try {
    await typeToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit materialLevel", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletematerialLevel = async (req, res, next) => {
  const { materialLevelId } = req.params;
  try {
    await materialLevelModel.findByIdAndRemove(materialLevelId);
  } catch (error) {
    res.json({
      message: "Could not found the specific materialLevel",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addmaterialLevel = addmaterialLevel;
exports.getmaterialLevel = getmaterialLevel;
exports.editmaterialLevel = editmaterialLevel;
exports.deletematerialLevel = deletematerialLevel;
