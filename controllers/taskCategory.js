const taskCategoryModel = require("../models/taskCategoryModel");
const addtaskCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createtaskCategoryModel = new taskCategoryModel({
    name,
    shortCode,
  });
  try {
    await createtaskCategoryModel.save();
  } catch (error) {
    res.json({ message: "Error adding task Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const gettaskCategory = async (req, res, next) => {
  let taskCategorys;
  try {
    taskCategorys = await taskCategoryModel.find({});
  } catch (error) {
    res.json({ message: "Error finding taskCategory list", error: true });
    return next(error);
  }
  res.json({
    taskCategory: taskCategorys.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const edittaskCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { taskCategoryId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await taskCategoryModel.findById(taskCategoryId);
  } catch (error) {
    res.json({ message: "Could not find the taskCategory", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit taskCategory", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletetaskCategory = async (req, res, next) => {
  const { taskCategoryId } = req.params;
  try {
    await taskCategoryModel.findByIdAndRemove(taskCategoryId);
  } catch (error) {
    res.json({
      message: "Could not found the specific taskCategory",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addtaskCategory = addtaskCategory;
exports.gettaskCategory = gettaskCategory;
exports.edittaskCategory = edittaskCategory;
exports.deletetaskCategory = deletetaskCategory;
