const taxCodeModel = require("../models/taxCodeModel");
const addtaxCode = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createtaxCodeModel = new taxCodeModel({
    name,
    shortCode,
  });
  try {
    await createtaxCodeModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const gettaxCode = async (req, res, next) => {
  let taxCodes;
  try {
    taxCodes = await taxCodeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding taxCode list", error: true });
    return next(error);
  }
  res.json({
    taxCodes: taxCodes.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const edittaxCode = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { taxCodeId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await taxCodeModel.findById(taxCodeId);
  } catch (error) {
    res.json({ message: "Could not find the taxCode", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit taxCode", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletetaxCode = async (req, res, next) => {
  const { taxCodeId } = req.params;
  try {
    await taxCodeModel.findByIdAndRemove(taxCodeId);
  } catch (error) {
    res.json({ message: "Could not found the specific taxCode", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addtaxCode = addtaxCode;
exports.gettaxCode = gettaxCode;
exports.edittaxCode = edittaxCode;
exports.deletetaxCode = deletetaxCode;
