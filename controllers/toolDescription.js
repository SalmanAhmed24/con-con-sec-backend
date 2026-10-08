const toolDescriptionModel = require("../models/toolDescription");
const addToolDescription = async (req, res, next) => {
  const { name, parentSubCategory, parentCategory } = req.body;
  const createtoolDescriptionModel = new toolDescriptionModel({
    name,
    parentSubCategory,
    parentCategory,
  });
  try {
    await createtoolDescriptionModel.save();
  } catch (error) {
    res.json({ message: "Error adding Sub Tool Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getToolDescription = async (req, res, next) => {
  let toolDescription;
  try {
    toolDescription = await toolDescriptionModel.find({});
  } catch (error) {
    res.json({ message: "Error finding subtoolCategory list", error: true });
    return next(error);
  }
  res.json({
    toolDescription: toolDescription.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editToolDescription = async (req, res, next) => {
  const { name, parentSubCategory, parentCategory } = req.body;
  const { subtoolCategoryId } = req.params;
  let toolDescriptionEdited;
  try {
    toolDescriptionEdited = await toolDescriptionModel.findById(
      subtoolCategoryId
    );
  } catch (error) {
    res.json({ message: "Could not find the subtoolCategory", error: true });
    return next(error);
  }
  toolDescriptionEdited.name = name;
  toolDescriptionEdited.parentSubCategory = parentSubCategory;
  toolDescriptionEdited.parentCategory = parentCategory;
  try {
    await toolDescriptionEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit subtoolCategory", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteToolDescription = async (req, res, next) => {
  const { subtoolCategoryId } = req.params;
  try {
    await toolDescriptionModel.findByIdAndRemove(subtoolCategoryId);
  } catch (error) {
    res.json({
      message: "Could not found the specific subtoolCategory",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addToolDescription = addToolDescription;
exports.getToolDescription = getToolDescription;
exports.editToolDescription = editToolDescription;
exports.deleteToolDescription = deleteToolDescription;
