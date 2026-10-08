const deviceCategoryModel = require("../models/deviceCategoryModel");
const adddeviceCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createdeviceCategoryModel = new deviceCategoryModel({
    name,
    shortCode,
  });
  try {
    await createdeviceCategoryModel.save();
  } catch (error) {
    res.json({ message: "Error adding device Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getdeviceCategory = async (req, res, next) => {
  let deviceCategorys;
  try {
    deviceCategorys = await deviceCategoryModel.find({});
  } catch (error) {
    res.json({ message: "Error finding deviceCategory list", error: true });
    return next(error);
  }
  res.json({
    deviceCategory: deviceCategorys.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editdeviceCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { deviceCategoryId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await deviceCategoryModel.findById(deviceCategoryId);
  } catch (error) {
    res.json({ message: "Could not find the deviceCategory", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit deviceCategory", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletedeviceCategory = async (req, res, next) => {
  const { deviceCategoryId } = req.params;
  try {
    await deviceCategoryModel.findByIdAndRemove(deviceCategoryId);
  } catch (error) {
    res.json({
      message: "Could not found the specific deviceCategory",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.adddeviceCategory = adddeviceCategory;
exports.getdeviceCategory = getdeviceCategory;
exports.editdeviceCategory = editdeviceCategory;
exports.deletedeviceCategory = deletedeviceCategory;
