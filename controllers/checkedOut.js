const checkedOutModel = require("../models/checkedOut");
const addCheckedOut = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createCheckedOutModel = new checkedOutModel({
    name,
    shortCode,
  });
  try {
    await createCheckedOutModel.save();
  } catch (error) {
    res.json({ message: "Error adding Checked Out", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getCheckedOut = async (req, res, next) => {
  let checkedOut;
  try {
    checkedOut = await checkedOutModel.find({});
  } catch (error) {
    res.json({ message: "Error finding list", error: true });
    return next(error);
  }
  res.json({
    checkedOut: checkedOut.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editCheckedOut = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { checkedOutId } = req.params;
  let checkedOutToBeEdited;
  try {
    checkedOutToBeEdited = await checkedOutModel.findById(checkedOutId);
  } catch (error) {
    res.json({ message: "Could not find the checked Out list", error: true });
    return next(error);
  }
  checkedOutToBeEdited.name = name;
  checkedOutToBeEdited.shortCode = shortCode;
  try {
    await checkedOutToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Checked Out", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteCheckedOut = async (req, res, next) => {
  const { checkedOutId } = req.params;
  try {
    await checkedOutModel.findByIdAndRemove(checkedOutId);
  } catch (error) {
    res.json({
      message: "Could not found the specific Checked Out",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addCheckedOut = addCheckedOut;
exports.getCheckedOut = getCheckedOut;
exports.editCheckedOut = editCheckedOut;
exports.deleteCheckedOut = deleteCheckedOut;
