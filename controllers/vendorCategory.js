const vendorCatModel = require("../models/vendorCategory");
const addVendorCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createVendorCatModel = new vendorCatModel({
    name,
    shortCode,
  });
  try {
    await createVendorCatModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getVendorCat = async (req, res, next) => {
  let vendorCategory;
  try {
    vendorCategory = await vendorCatModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    vendorCategorys: vendorCategory.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editVendorCat = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { vendorCatId } = req.params;
  let vendorCategoryToBeEdited;
  try {
    vendorCategoryToBeEdited = await vendorCatModel.findById(vendorCatId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  vendorCategoryToBeEdited.name = name;
  vendorCategoryToBeEdited.shortCode = shortCode;
  try {
    await vendorCategoryToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteVendorCat = async (req, res, next) => {
  const { vendorCatId } = req.params;
  try {
    await vendorCatModel.findByIdAndRemove(vendorCatId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addVendorCategory = addVendorCategory;
exports.getVendorCat = getVendorCat;
exports.editVendorCat = editVendorCat;
exports.deleteVendorCat = deleteVendorCat;
