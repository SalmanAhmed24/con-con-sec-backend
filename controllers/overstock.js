const overstockModel = require("../models/overstock");
const addOverstock = async (req, res, next) => {
  const { overstockCategory, itemDesc, estAvail } = req.body;
  const createoverstockModel = new overstockModel({
    overstockCategory,
    itemDesc,
    estAvail,
  });
  try {
    await createoverstockModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getOverstock = async (req, res, next) => {
  const { overstockCategory, itemDesc } = req.query;
  console.log("****", overstockCategory);
  if (overstockCategory !== undefined || itemDesc !== undefined) {
    let overstocks;
    try {
      overstocks = await overstockModel.find({
        overstockCategory: { $regex: overstockCategory, $options: "i" },
        itemDesc: { $regex: itemDesc, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding userType list", error: true });
      return next(error);
    }
    res.json({
      overstocks: overstocks.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  } else {
    let overstocks;
    try {
      overstocks = await overstockModel.find({});
    } catch (error) {
      res.json({ message: "Error finding userType list", error: true });
      return next(error);
    }
    res.json({
      overstocks: overstocks.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
};
const editOverstock = async (req, res, next) => {
  const { overstockCategory, itemDesc, estAvail } = req.body;
  const { overstockId } = req.params;
  let overstockToBeEdited;
  try {
    overstockToBeEdited = await overstockModel.findById(overstockId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  overstockToBeEdited.overstockCategory = overstockCategory;
  overstockToBeEdited.itemDesc = itemDesc;
  overstockToBeEdited.estAvail = estAvail;
  try {
    await overstockToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteOverstock = async (req, res, next) => {
  const { overstockId } = req.params;
  try {
    await overstockModel.findByIdAndRemove(overstockId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addOverstock = addOverstock;
exports.getOverstock = getOverstock;
exports.editOverstock = editOverstock;
exports.deleteOverstock = deleteOverstock;
