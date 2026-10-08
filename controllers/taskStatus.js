const taskStatusModel = require("../models/taskStatusModel");
const addtaskStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createtaskStatusModel = new taskStatusModel({
    name,
    shortCode,
  });
  try {
    await createtaskStatusModel.save();
  } catch (error) {
    res.json({ message: "Error adding task Status", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const gettaskStatus = async (req, res, next) => {
  let taskStatuss;
  try {
    taskStatuss = await taskStatusModel.find({});
  } catch (error) {
    res.json({ message: "Error finding taskStatus list", error: true });
    return next(error);
  }
  res.json({
    taskStatus: taskStatuss.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const edittaskStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { taskStatusId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await taskStatusModel.findById(taskStatusId);
  } catch (error) {
    res.json({ message: "Could not find the taskStatus", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit taskStatus", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletetaskStatus = async (req, res, next) => {
  const { taskStatusId } = req.params;
  try {
    await taskStatusModel.findByIdAndRemove(taskStatusId);
  } catch (error) {
    res.json({
      message: "Could not found the specific taskStatus",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addtaskStatus = addtaskStatus;
exports.gettaskStatus = gettaskStatus;
exports.edittaskStatus = edittaskStatus;
exports.deletetaskStatus = deletetaskStatus;
