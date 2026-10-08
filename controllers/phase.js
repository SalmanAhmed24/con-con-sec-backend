const phaseModel = require("../models/phaseModel");
const addphase = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createphaseModel = new phaseModel({
    name,
    shortCode,
  });
  try {
    await createphaseModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getPhase = async (req, res, next) => {
  let phases;
  try {
    phases = await phaseModel.find({});
  } catch (error) {
    res.json({ message: "Error finding phase list", error: true });
    return next(error);
  }
  res.json({
    phases: phases.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editphase = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { phaseId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await phaseModel.findById(phaseId);
  } catch (error) {
    res.json({ message: "Could not find the phase", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit phase", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletephase = async (req, res, next) => {
  const { phaseId } = req.params;
  try {
    await phaseModel.findByIdAndRemove(phaseId);
  } catch (error) {
    res.json({ message: "Could not found the specific phase", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addphase = addphase;
exports.getPhase = getPhase;
exports.editphase = editphase;
exports.deletephase = deletephase;
