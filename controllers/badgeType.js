const BadgeType = require("../models/badgeType");
const addBadgeType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createBadgeType = new BadgeType({
    name,
    shortCode,
  });
  try {
    await createBadgeType.save();
  } catch (error) {
    res.json({ message: "Error adding badge list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getBadgeType = async (req, res, next) => {
  let BadgeTypes;
  try {
    BadgeTypes = await BadgeType.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    BadgeTypes: BadgeTypes.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editBadgeType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { badgeTypeId } = req.params;
  let BadgeTypeToBeEdited;
  try {
    BadgeTypeToBeEdited = await BadgeType.findById(badgeTypeId);
  } catch (error) {
    res.json({ message: "Could not find the BadgeType", error: true });
    return next(error);
  }
  BadgeTypeToBeEdited.name = name;
  BadgeTypeToBeEdited.shortCode = shortCode;
  try {
    await BadgeTypeToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit BadgeType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteBadgeType = async (req, res, next) => {
  const { badgeTypeId } = req.params;
  try {
    await BadgeType.findByIdAndRemove(badgeTypeId);
  } catch (error) {
    res.json({
      message: "Could not found the specific BadgeType",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addBadgeType = addBadgeType;
exports.getBadgeType = getBadgeType;
exports.editBadgeType = editBadgeType;
exports.deleteBadgeType = deleteBadgeType;
