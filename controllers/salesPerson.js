const salesPersonCodeModel = require("../models/salesPersonModel");
const addsalesPersonCode = async (req, res, next) => {
  const { salesPersonCode } = req.body;
  const createsalesPersonCodeModel = new salesPersonCodeModel({
    salesPersonCode,
  });
  try {
    await createsalesPersonCodeModel.save();
  } catch (error) {
    res.json({ message: "Error adding Customer Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getsalesPersonCode = async (req, res, next) => {
  let salesPersonCodes;
  try {
    salesPersonCodes = await salesPersonCodeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding salesPersonCode list", error: true });
    return next(error);
  }
  res.json({
    salesPersonCodes: salesPersonCodes.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editsalesPersonCode = async (req, res, next) => {
  const { salesPersonCode } = req.body;
  const { salesPersonCodeId } = req.params;
  let typeToBeEdited;
  try {
    typeToBeEdited = await salesPersonCodeModel.findById(salesPersonCodeId);
  } catch (error) {
    res.json({ message: "Could not find the salesPersonCode", error: true });
    return next(error);
  }
  typeToBeEdited.salesPersonCode = salesPersonCode;
  try {
    await typeToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit salesPersonCode", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deletesalesPersonCode = async (req, res, next) => {
  const { salesPersonCodeId } = req.params;
  try {
    await salesPersonCodeModel.findByIdAndRemove(salesPersonCodeId);
  } catch (error) {
    res.json({
      message: "Could not found the specific salesPersonCode",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addsalesPersonCode = addsalesPersonCode;
exports.getsalesPersonCode = getsalesPersonCode;
exports.editsalesPersonCode = editsalesPersonCode;
exports.deletesalesPersonCode = deletesalesPersonCode;
