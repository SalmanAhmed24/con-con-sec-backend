const timeoutReasonModel = require("../models/timeoutReasonModel");
const addTimeoutReason = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createtimeoutReasonModel = new timeoutReasonModel({
    name,
    shortCode,
  });
  try {
    await createtimeoutReasonModel.save();
  } catch (error) {
    res.json({ message: "Error adding Building", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTimeoutReason = async (req, res, next) => {
  let timeoutReasons;
  try {
    timeoutReasons = await timeoutReasonModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Building list", error: true });
    return next(error);
  }
  res.json({
    timeoutReasons: timeoutReasons.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editTimeoutReason = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { reasonId } = req.params;
  let timeoutReasonToBeEdited;
  try {
    timeoutReasonToBeEdited = await timeoutReasonModel.findById(reasonId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  timeoutReasonToBeEdited.name = name;
  timeoutReasonToBeEdited.shortCode = shortCode;
  try {
    await timeoutReasonToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTimeoutReason = async (req, res, next) => {
  const { reasonId } = req.params;
  try {
    await timeoutReasonModel.findByIdAndRemove(reasonId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addTimeoutReason = addTimeoutReason;
exports.getTimeoutReason = getTimeoutReason;
exports.editTimeoutReason = editTimeoutReason;
exports.deleteTimeoutReason = deleteTimeoutReason;
