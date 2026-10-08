const storageIdModel = require("../models/storageId");
const addStorageId = async (req, res, next) => {
  const { name, parentCategory } = req.body;
  const createstorageIdModel = new storageIdModel({
    name,
    parentCategory,
  });
  try {
    await createstorageIdModel.save();
  } catch (error) {
    res.json({ message: "Error adding Sub Tool Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getStorageId = async (req, res, next) => {
  let storageIds;
  try {
    storageIds = await storageIdModel.find({});
  } catch (error) {
    res.json({ message: "Error finding storageID list", error: true });
    return next(error);
  }
  res.json({
    storageIds: storageIds.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editStorageId = async (req, res, next) => {
  const { name, parentCategory } = req.body;
  const { storage } = req.params;
  let storageIdToBeEdited;
  try {
    storageIdToBeEdited = await storageIdModel.findById(storage);
  } catch (error) {
    res.json({ message: "Could not find the StorageId", error: true });
    return next(error);
  }
  storageIdToBeEdited.name = name;
  storageIdToBeEdited.parentCategory = parentCategory;
  try {
    await storageIdToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit StorageId", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteStorageId = async (req, res, next) => {
  const { storage } = req.params;
  try {
    await storageIdModel.findByIdAndRemove(storage);
  } catch (error) {
    res.json({
      message: "Could not found the specific subtoolCategory",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addStorageId = addStorageId;
exports.getStorageId = getStorageId;
exports.editStorageId = editStorageId;
exports.deleteStorageId = deleteStorageId;
