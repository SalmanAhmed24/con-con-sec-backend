const timeoutModel = require("../models/timeoutModel");
const moment = require("moment");
const addTimeout = async (req, res, next) => {
  const {
    dateAdded,
    user,
    startDate,
    endDate,
    reason,
    jamieFlag,
    managementFlag,
    enteredBy,
    status,
  } = req.body;
  console.log("##$$%%", req.body);
  const createtimeoutModel = new timeoutModel({
    dateAdded: moment(new Date()).format("MM-DD-YYYY"),
    user,
    startDate,
    enteredBy,
    endDate,
    reason,
    jamieFlag,
    managementFlag,
    status,
  });
  try {
    await createtimeoutModel.save();
  } catch (error) {
    res.json({ message: "Error adding Timeout", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTimeout = async (req, res, next) => {
  let timeouts;
  try {
    timeouts = await timeoutModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Building list", error: true });
    return next(error);
  }
  res.json({
    timeouts: timeouts.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editTimeout = async (req, res, next) => {
  const {
    dateAdded,
    startDate,
    endDate,
    reason,
    jamieFlag,
    managementFlag,
    status,
    enteredBy,
  } = req.body;
  console.log("dateadded", dateAdded);
  const { timeoutId } = req.params;
  let timeoutToBeEdited;
  try {
    timeoutToBeEdited = await timeoutModel.findById(timeoutId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  timeoutToBeEdited.dateAdded =
    dateAdded == "Invalid date"
      ? moment(new Date()).format("YYYY-MM-DD")
      : dateAdded;
  timeoutToBeEdited.startDate = startDate;
  timeoutToBeEdited.endDate = endDate;
  timeoutToBeEdited.reason = reason;
  timeoutToBeEdited.jamieFlag = jamieFlag;
  timeoutToBeEdited.managementFlag = managementFlag;
  timeoutToBeEdited.status = status;
  timeoutToBeEdited.enteredBy = enteredBy;
  try {
    await timeoutToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Timeout", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const changeStatus = async (req, res, next) => {
  const { status } = req.body;
  const { timeoutId } = req.params;
  console.log("@@##", status);
  console.log("@@##id", timeoutId);
  let timeoutToBeEdited;
  try {
    timeoutToBeEdited = await timeoutModel.findById(timeoutId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  timeoutToBeEdited.status = status;
  try {
    await timeoutToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Timeout", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTimeout = async (req, res, next) => {
  const { timeoutId } = req.params;
  try {
    await timeoutModel.findByIdAndRemove(timeoutId);
  } catch (error) {
    res.json({ message: "Could not found the specific data", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addTimeout = addTimeout;
exports.getTimeout = getTimeout;
exports.editTimeout = editTimeout;
exports.deleteTimeout = deleteTimeout;
exports.changeStatus = changeStatus;
