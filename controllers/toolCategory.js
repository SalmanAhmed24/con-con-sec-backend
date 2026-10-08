const toolCategoryModel = require("../models/toolCategoryModel");
const addtoolCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createtoolCategoryModel = new toolCategoryModel({
    name,
    shortCode,
  });
  try {
    await createtoolCategoryModel.save();
  } catch (error) {
    res.json({ message: "Error adding Tool Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const gettoolCategory = async (req, res, next) => {
  let toolCategorys;
  try {
    toolCategorys = await toolCategoryModel.find({});
  } catch (error) {
    res.json({ message: "Error finding toolCategory list", error: true });
    return next(error);
  }
  res.json({
    toolCategory: toolCategorys.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const edittoolCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { toolCategoryId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await toolCategoryModel.findById(toolCategoryId);
  } catch (error) {
    res.json({ message: "Could not find the toolCategory", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit toolCategory", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletetoolCategory = async (req, res, next) => {
  const { toolCategoryId } = req.params;
  try {
    await toolCategoryModel.findByIdAndRemove(toolCategoryId);
  } catch (error) {
    res.json({
      message: "Could not found the specific toolCategory",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addtoolCategory = addtoolCategory;
exports.gettoolCategory = gettoolCategory;
exports.edittoolCategory = edittoolCategory;
exports.deletetoolCategory = deletetoolCategory;
