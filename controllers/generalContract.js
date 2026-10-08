const generalContractModel = require("../models/generalContract");
const addGeneralContract = async (req, res, next) => {
  const {
    companyName,
    contact,
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    website,
  } = req.body;
  const createGeneralContractModel = new generalContractModel({
    companyName,
    contact,
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    website,
  });
  try {
    await createGeneralContractModel.save();
  } catch (error) {
    res.json({ message: "Error adding Device", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getGeneralContract = async (req, res, next) => {
  let generalContracts;
  try {
    generalContracts = await generalContractModel.find({});
  } catch (error) {
    res.json({ message: "Error finding General Contractor list", error: true });
    return next(error);
  }
  res.json({
    generalContracts: generalContracts.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editGeneralContract = async (req, res, next) => {
  const {
    companyName,
    contact,
    address,
    city,
    state,
    zipCode,
    phone,
    email,
    website,
  } = req.body;
  const { contractId } = req.params;
  let contractToBeEdited;
  try {
    contractToBeEdited = await generalContractModel.findById(contractId);
  } catch (error) {
    res.json({ message: "Could not find the General Contractor", error: true });
    return next(error);
  }
  contractToBeEdited.companyName = companyName;
  contractToBeEdited.contact = contact;
  contractToBeEdited.address = address;
  contractToBeEdited.city = city;
  contractToBeEdited.state = state;
  contractToBeEdited.zipCode = zipCode;
  contractToBeEdited.phone = phone;
  contractToBeEdited.email = email;
  contractToBeEdited.website = website;
  try {
    await contractToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit General Contractor", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteGeneralContract = async (req, res, next) => {
  const { contractId } = req.params;
  try {
    await generalContractModel.findByIdAndRemove(contractId);
  } catch (error) {
    res.json({
      message: "Could not found the specific general contractor",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addGeneralContract = addGeneralContract;
exports.getGeneralContract = getGeneralContract;
exports.editGeneralContract = editGeneralContract;
exports.deleteGeneralContract = deleteGeneralContract;
