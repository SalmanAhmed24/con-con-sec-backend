const notesCategoryModel = require("../models/notesCategoryModel");
const addnotesCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createnotesCategoryModel = new notesCategoryModel({
    name,
    shortCode,
  });
  try {
    await createnotesCategoryModel.save();
  } catch (error) {
    res.json({ message: "Error adding notes Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getnotesCategory = async (req, res, next) => {
  let notesCategorys;
  try {
    notesCategorys = await notesCategoryModel.find({});
  } catch (error) {
    res.json({ message: "Error finding notesCategory list", error: true });
    return next(error);
  }
  res.json({
    notesCategory: notesCategorys.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editnotesCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { notesCategoryId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await notesCategoryModel.findById(notesCategoryId);
  } catch (error) {
    res.json({ message: "Could not find the notesCategory", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit notesCategory", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletenotesCategory = async (req, res, next) => {
  const { notesCategoryId } = req.params;
  try {
    await notesCategoryModel.findByIdAndRemove(notesCategoryId);
  } catch (error) {
    res.json({
      message: "Could not found the specific notesCategory",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addnotesCategory = addnotesCategory;
exports.getnotesCategory = getnotesCategory;
exports.editnotesCategory = editnotesCategory;
exports.deletenotesCategory = deletenotesCategory;
