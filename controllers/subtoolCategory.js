const subtoolCategoryModel = require("../models/subtoolCategoryModel");
const addsubtoolCategory = async (req, res, next) => {
  const { name, parentCategory } = req.body;
  const createsubtoolCategoryModel = new subtoolCategoryModel({
    name,
    parentCategory,
  });
  try {
    await createsubtoolCategoryModel.save();
  } catch (error) {
    res.json({ message: "Error adding Sub Tool Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getsubtoolCategory = async (req, res, next) => {
  let subtoolCategorys;
  try {
    subtoolCategorys = await subtoolCategoryModel.find({});
  } catch (error) {
    res.json({ message: "Error finding subtoolCategory list", error: true });
    return next(error);
  }
  res.json({
    subtoolCategorys: subtoolCategorys.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editsubtoolCategory = async (req, res, next) => {
  const { name, parentCategory } = req.body;
  const { subtoolCategoryId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await subtoolCategoryModel.findById(subtoolCategoryId);
  } catch (error) {
    res.json({ message: "Could not find the subtoolCategory", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.parentCategory = parentCategory;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit subtoolCategory", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletesubtoolCategory = async (req, res, next) => {
  const { subtoolCategoryId } = req.params;
  try {
    await subtoolCategoryModel.findByIdAndRemove(subtoolCategoryId);
  } catch (error) {
    res.json({
      message: "Could not found the specific subtoolCategory",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addsubtoolCategory = addsubtoolCategory;
exports.getsubtoolCategory = getsubtoolCategory;
exports.editsubtoolCategory = editsubtoolCategory;
exports.deletesubtoolCategory = deletesubtoolCategory;
