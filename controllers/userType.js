const userTypeModel = require("../models/userTypeModel");
const addUserType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createUserTypeModel = new userTypeModel({
    name,
    shortCode,
  });
  try {
    await createUserTypeModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getUsersType = async (req, res, next) => {
  let userTypes;
  try {
    userTypes = await userTypeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    userTypes: userTypes.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editUserType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { userTypeId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await userTypeModel.findById(userTypeId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  userToBeEdited.name = name;
  userToBeEdited.shortCode = shortCode;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteUserType = async (req, res, next) => {
  const { userTypeId } = req.params;
  try {
    await userTypeModel.findByIdAndRemove(userTypeId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addUserType = addUserType;
exports.getUsersType = getUsersType;
exports.editUserType = editUserType;
exports.deleteUserType = deleteUserType;
