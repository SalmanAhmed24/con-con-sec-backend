const termsModel = require("../models/terms");
const addTerms = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createTermsModel = new termsModel({
    name,
    shortCode,
  });
  try {
    await createTermsModel.save();
  } catch (error) {
    res.json({ message: "Error adding Term", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTerms = async (req, res, next) => {
  let terms;
  try {
    terms = await termsModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Terms list", error: true });
    return next(error);
  }
  res.json({
    terms: terms.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editTerms = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { termsId } = req.params;
  let termToBeEdited;
  try {
    termToBeEdited = await termsModel.findById(termsId);
  } catch (error) {
    res.json({ message: "Could not find the Term", error: true });
    return next(error);
  }
  termToBeEdited.name = name;
  termToBeEdited.shortCode = shortCode;
  try {
    await termToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Tern", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTerms = async (req, res, next) => {
  const { termsId } = req.params;
  try {
    await termsModel.findByIdAndRemove(termsId);
  } catch (error) {
    res.json({ message: "Could not found the specific Term", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addTerms = addTerms;
exports.getTerms = getTerms;
exports.editTerms = editTerms;
exports.deleteTerms = deleteTerms;
