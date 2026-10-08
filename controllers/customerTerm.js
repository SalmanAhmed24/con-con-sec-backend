const customerTermModel = require("../models/customerTermModel");
const addCustomerTerm = async (req, res, next) => {
  const { days, description } = req.body;
  const createCustomerTermModel = new customerTermModel({
    days,
    description,
  });
  try {
    await createCustomerTermModel.save();
  } catch (error) {
    res.json({ message: "Error adding Customer Term", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getCustomerTerm = async (req, res, next) => {
  let customerTerms;
  try {
    customerTerms = await customerTermModel.find({});
  } catch (error) {
    res.json({ message: "Error finding customerTerm list", error: true });
    return next(error);
  }
  res.json({
    customerTerms: customerTerms.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editCustomerTerm = async (req, res, next) => {
  const { days, description } = req.body;
  const { customerTermId } = req.params;
  let TermToBeEdited;
  try {
    TermToBeEdited = await customerTermModel.findById(customerTermId);
  } catch (error) {
    res.json({ message: "Could not find the customerTerm", error: true });
    return next(error);
  }
  TermToBeEdited.days = days;
  TermToBeEdited.description = description;
  try {
    await TermToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit customerTerm", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteCustomerTerm = async (req, res, next) => {
  const { customerTermId } = req.params;
  try {
    await customerTermModel.findByIdAndRemove(customerTermId);
  } catch (error) {
    res.json({
      message: "Could not found the specific customerTerm",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addCustomerTerm = addCustomerTerm;
exports.getCustomerTerm = getCustomerTerm;
exports.editCustomerTerm = editCustomerTerm;
exports.deleteCustomerTerm = deleteCustomerTerm;
