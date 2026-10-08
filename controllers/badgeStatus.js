const BadgeStatus = require("../models/badgeStatus");
const addBadgeStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createBadgeStatus = new BadgeStatus({
    name,
    shortCode,
  });
  try {
    await createBadgeStatus.save();
  } catch (error) {
    res.json({ message: "Error adding badge list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getBadgeStatus = async (req, res, next) => {
  let BadgeStatuss;
  try {
    BadgeStatuss = await BadgeStatus.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    BadgeStatus: BadgeStatuss.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editBadgeStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { badgeStatusId } = req.params;
  let BadgeStatusToBeEdited;
  try {
    BadgeStatusToBeEdited = await BadgeStatus.findById(badgeStatusId);
  } catch (error) {
    res.json({ message: "Could not find the BadgeStatus", error: true });
    return next(error);
  }
  BadgeStatusToBeEdited.name = name;
  BadgeStatusToBeEdited.shortCode = shortCode;
  try {
    await BadgeStatusToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit BadgeStatus", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteBadgeStatus = async (req, res, next) => {
  const { badgeStatusId } = req.params;
  try {
    await BadgeStatus.findByIdAndRemove(badgeStatusId);
  } catch (error) {
    res.json({
      message: "Could not found the specific BadgeStatus",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addBadgeStatus = addBadgeStatus;
exports.getBadgeStatus = getBadgeStatus;
exports.editBadgeStatus = editBadgeStatus;
exports.deleteBadgeStatus = deleteBadgeStatus;
