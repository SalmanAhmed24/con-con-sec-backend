const brandModel = require("../models/brand");
const addbrand = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createbrandModel = new brandModel({
    name,
    shortCode,
  });
  try {
    await createbrandModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getbrand = async (req, res, next) => {
  let brands;
  try {
    brands = await brandModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    brands: brands.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editbrand = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { brandId } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await brandModel.findById(brandId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  jobToBeEdited.name = name;
  jobToBeEdited.shortCode = shortCode;
  try {
    await jobToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletebrand = async (req, res, next) => {
  const { brandId } = req.params;
  try {
    await brandModel.findByIdAndRemove(brandId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addbrand = addbrand;
exports.getbrand = getbrand;
exports.editbrand = editbrand;
exports.deletebrand = deletebrand;
