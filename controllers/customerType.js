const customerTypeModel = require("../models/customerTypeModel");
const addCustomerType = async (req, res, next) => {
  const { customerType } = req.body;
  const createCustomerTypeModel = new customerTypeModel({
    customerType,
  });
  try {
    await createCustomerTypeModel.save();
  } catch (error) {
    res.json({ message: "Error adding Customer Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getCustomerType = async (req, res, next) => {
  let customerTypes;
  try {
    customerTypes = await customerTypeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding customerType list", error: true });
    return next(error);
  }
  res.json({
    customerTypes: customerTypes.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editCustomerType = async (req, res, next) => {
  const { customerType } = req.body;
  const { customerTypeId } = req.params;
  let typeToBeEdited;
  try {
    typeToBeEdited = await customerTypeModel.findById(customerTypeId);
  } catch (error) {
    res.json({ message: "Could not find the customerType", error: true });
    return next(error);
  }
  typeToBeEdited.customerType = customerType;
  try {
    await typeToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit customerType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteCustomerType = async (req, res, next) => {
  const { customerTypeId } = req.params;
  try {
    await customerTypeModel.findByIdAndRemove(customerTypeId);
  } catch (error) {
    res.json({
      message: "Could not found the specific customerType",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addCustomerType = addCustomerType;
exports.getCustomerType = getCustomerType;
exports.editCustomerType = editCustomerType;
exports.deleteCustomerType = deleteCustomerType;
