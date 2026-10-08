const overstockCategories = require("../models/overstockCategories");
const addOverstockCat = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createoverstockCategories = new overstockCategories({
    name,
    shortCode,
  });
  try {
    await createoverstockCategories.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getOverstockCat = async (req, res, next) => {
  let overstockCats;
  try {
    overstockCats = await overstockCategories.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    overstockCats: overstockCats.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editOverstockCat = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { overstockCatId } = req.params;
  let overstockCatToBeEdited;
  try {
    overstockCatToBeEdited = await overstockCategories.findById(overstockCatId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  overstockCatToBeEdited.name = name;
  overstockCatToBeEdited.shortCode = shortCode;
  try {
    await overstockCatToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteOverstockCat = async (req, res, next) => {
  const { overstockCatId } = req.params;
  try {
    await overstockCategories.findByIdAndRemove(overstockCatId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addOverstockCat = addOverstockCat;
exports.getOverstockCat = getOverstockCat;
exports.editOverstockCat = editOverstockCat;
exports.deleteOverstockCat = deleteOverstockCat;
