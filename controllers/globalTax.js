const globalTaxModel = require("../models/globalTax");
const addGlobalTax = async (req, res, next) => {
  const { taxValue } = req.body;
  const createGlobalTaxModel = new globalTaxModel({
    taxValue,
  });
  try {
    await createGlobalTaxModel.save();
  } catch (error) {
    res.json({ message: "Error adding Tax", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getGlobalTax = async (req, res, next) => {
  let globalTaxs;
  try {
    globalTaxs = await globalTaxModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Tax", error: true });
    return next(error);
  }
  res.json({
    globalTaxs: globalTaxs.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editGlobalTax = async (req, res, next) => {
  const { taxValue } = req.body;
  const { id } = req.params;
  let taxToBeEdited;
  try {
    taxToBeEdited = await globalTaxModel.findById(id);
  } catch (error) {
    res.json({ message: "Could not find the Value", error: true });
    return next(error);
  }
  taxToBeEdited.taxValue = taxValue;
  try {
    await taxToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Tax", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
exports.getGlobalTax = getGlobalTax;
exports.editGlobalTax = editGlobalTax;
exports.addGlobalTax = addGlobalTax;
