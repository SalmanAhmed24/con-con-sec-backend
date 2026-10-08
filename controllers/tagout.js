const tagoutModel = require("../models/tagoutModel");
const addTagout = async (req, res, next) => {
  const {
    currentDate,
    user,
    tagNumber,
    equipmentName,
    equipmentLocation,
    name,
    phone,
    dateApplied,
    releasedDate,
    releasedInitials,
  } = req.body;
  const createTagoutModel = new tagoutModel({
    currentDate,
    user,
    tagNumber,
    equipmentName,
    equipmentLocation,
    name,
    phone,
    dateApplied,
    releasedDate,
    releasedInitials,
  });
  try {
    await createTagoutModel.save();
  } catch (error) {
    res.json({ message: "Error adding Tagout", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTagout = async (req, res, next) => {
  let tagouts;
  try {
    tagouts = await tagoutModel.find({});
  } catch (error) {
    res.json({ message: "Error finding tagouts", error: true });
    return next(error);
  }
  res.json({
    tagouts: tagouts.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editTagout = async (req, res, next) => {
  const {
    currentDate,
    user,
    tagNumber,
    equipmentName,
    equipmentLocation,
    name,
    phone,
    dateApplied,
    releasedDate,
    releasedInitials,
  } = req.body;
  const { tagoutId } = req.params;
  let tagoutToBeEdited;
  try {
    tagoutToBeEdited = await tagoutModel.findById(tagoutId);
  } catch (error) {
    res.json({ message: "Could not find the tagout", error: true });
    return next(error);
  }
  tagoutToBeEdited.currentDate = currentDate;
  tagoutToBeEdited.user = user;
  tagoutToBeEdited.tagNumber = tagNumber;
  tagoutToBeEdited.equipmentName = equipmentName;
  tagoutToBeEdited.equipmentLocation = equipmentLocation;
  tagoutToBeEdited.name = name;
  tagoutToBeEdited.phone = phone;
  tagoutToBeEdited.dateApplied = dateApplied;
  tagoutToBeEdited.releasedDate = releasedDate;
  tagoutToBeEdited.releasedInitials = releasedInitials;

  try {
    await tagoutToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tagout", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTagout = async (req, res, next) => {
  const { tagoutId } = req.params;
  try {
    await tagoutModel.findByIdAndRemove(tagoutId);
  } catch (error) {
    res.json({ message: "Could not found the specific tagout", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addTagout = addTagout;
exports.getTagout = getTagout;
exports.editTagout = editTagout;
exports.deleteTagout = deleteTagout;
