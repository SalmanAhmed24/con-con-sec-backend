const taskPriorityModel = require("../models/taskPriorityModel");
const addtaskPriority = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createtaskPriorityModel = new taskPriorityModel({
    name,
    shortCode,
  });
  try {
    await createtaskPriorityModel.save();
  } catch (error) {
    res.json({ message: "Error adding task Status", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const gettaskPriority = async (req, res, next) => {
  let taskPrioritys;
  try {
    taskPrioritys = await taskPriorityModel.find({});
  } catch (error) {
    res.json({ message: "Error finding taskPriority list", error: true });
    return next(error);
  }
  res.json({
    taskPriority: taskPrioritys.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const edittaskPriority = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { taskPriorityId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await taskPriorityModel.findById(taskPriorityId);
  } catch (error) {
    res.json({ message: "Could not find the taskPriority", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit taskPriority", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletetaskPriority = async (req, res, next) => {
  const { taskPriorityId } = req.params;
  try {
    await taskPriorityModel.findByIdAndRemove(taskPriorityId);
  } catch (error) {
    res.json({
      message: "Could not found the specific taskPriority",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addtaskPriority = addtaskPriority;
exports.gettaskPriority = gettaskPriority;
exports.edittaskPriority = edittaskPriority;
exports.deletetaskPriority = deletetaskPriority;
