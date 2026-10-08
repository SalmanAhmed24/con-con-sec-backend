const laborLevelModel = require("../models/laborLevelModel");
const addlaborLevel = async (req, res, next) => {
  const { laborLevel } = req.body;
  const createlaborLevelModel = new laborLevelModel({
    laborLevel,
  });
  try {
    await createlaborLevelModel.save();
  } catch (error) {
    res.json({ message: "Error adding Customer Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getlaborLevel = async (req, res, next) => {
  let laborLevels;
  try {
    laborLevels = await laborLevelModel.find({});
  } catch (error) {
    res.json({ message: "Error finding laborLevel list", error: true });
    return next(error);
  }
  res.json({
    laborLevels: laborLevels.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editlaborLevel = async (req, res, next) => {
  const { laborLevel } = req.body;
  const { laborLevelId } = req.params;
  let typeToBeEdited;
  try {
    typeToBeEdited = await laborLevelModel.findById(laborLevelId);
  } catch (error) {
    res.json({ message: "Could not find the laborLevel", error: true });
    return next(error);
  }
  typeToBeEdited.laborLevel = laborLevel;
  try {
    await typeToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit laborLevel", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletelaborLevel = async (req, res, next) => {
  const { laborLevelId } = req.params;
  try {
    await laborLevelModel.findByIdAndRemove(laborLevelId);
  } catch (error) {
    res.json({
      message: "Could not found the specific laborLevel",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addlaborLevel = addlaborLevel;
exports.getlaborLevel = getlaborLevel;
exports.editlaborLevel = editlaborLevel;
exports.deletelaborLevel = deletelaborLevel;
