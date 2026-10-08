const taskTag = require("../models/taskTag");
const addtaskTag = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createtaskTag = new taskTag({
    name,
    shortCode,
  });
  try {
    await createtaskTag.save();
  } catch (error) {
    res.json({ message: "Error adding badge list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const gettaskTag = async (req, res, next) => {
  let taskTags;
  try {
    taskTags = await taskTag.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    taskTags: taskTags.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const edittaskTag = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { taskTagId } = req.params;
  let taskTagToBeEdited;
  try {
    taskTagToBeEdited = await taskTag.findById(taskTagId);
  } catch (error) {
    res.json({ message: "Could not find the taskTag", error: true });
    return next(error);
  }
  taskTagToBeEdited.name = name;
  taskTagToBeEdited.shortCode = shortCode;
  try {
    await taskTagToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit taskTag", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletetaskTag = async (req, res, next) => {
  const { taskTagId } = req.params;
  try {
    await taskTag.findByIdAndRemove(taskTagId);
  } catch (error) {
    res.json({
      message: "Could not found the specific taskTag",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addtaskTag = addtaskTag;
exports.gettaskTag = gettaskTag;
exports.edittaskTag = edittaskTag;
exports.deletetaskTag = deletetaskTag;
