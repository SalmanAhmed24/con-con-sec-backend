const badgeList = require("../models/badgeList");
const addBadgeList = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createbadgeList = new badgeList({
    name,
    shortCode,
  });
  try {
    await createbadgeList.save();
  } catch (error) {
    res.json({ message: "Error adding badge list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getBadgeList = async (req, res, next) => {
  let badgeLists;
  try {
    badgeLists = await badgeList.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    badgeLists: badgeLists.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editBadgeList = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { badgeListId } = req.params;
  let badgeListToBeEdited;
  try {
    badgeListToBeEdited = await badgeList.findById(badgeListId);
  } catch (error) {
    res.json({ message: "Could not find the badgeList", error: true });
    return next(error);
  }
  badgeListToBeEdited.name = name;
  badgeListToBeEdited.shortCode = shortCode;
  try {
    await badgeListToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit badgeList", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteBadgeList = async (req, res, next) => {
  const { badgeListId } = req.params;
  try {
    await badgeList.findByIdAndRemove(badgeListId);
  } catch (error) {
    res.json({
      message: "Could not found the specific badgeList",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addBadgeList = addBadgeList;
exports.getBadgeList = getBadgeList;
exports.editBadgeList = editBadgeList;
exports.deleteBadgeList = deleteBadgeList;
