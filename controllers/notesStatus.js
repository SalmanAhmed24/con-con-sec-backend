const notesStatusModel = require("../models/notesStatusModel");
const addnotesStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createnotesStatusModel = new notesStatusModel({
    name,
    shortCode,
  });
  try {
    await createnotesStatusModel.save();
  } catch (error) {
    res.json({ message: "Error adding notes Status", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getnotesStatus = async (req, res, next) => {
  let notesStatuss;
  try {
    notesStatuss = await notesStatusModel.find({});
  } catch (error) {
    res.json({ message: "Error finding notesStatus list", error: true });
    return next(error);
  }
  res.json({
    notesStatus: notesStatuss.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editnotesStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { notesStatusId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await notesStatusModel.findById(notesStatusId);
  } catch (error) {
    res.json({ message: "Could not find the notesStatus", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit notesStatus", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletenotesStatus = async (req, res, next) => {
  const { notesStatusId } = req.params;
  try {
    await notesStatusModel.findByIdAndRemove(notesStatusId);
  } catch (error) {
    res.json({
      message: "Could not found the specific notesStatus",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addnotesStatus = addnotesStatus;
exports.getnotesStatus = getnotesStatus;
exports.editnotesStatus = editnotesStatus;
exports.deletenotesStatus = deletenotesStatus;
