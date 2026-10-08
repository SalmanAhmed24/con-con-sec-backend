const storageLocation = require("../models/storageLocation");
const addStorageLocation = async (req, res, next) => {
  const { building, storageId, notes, description } = req.body;
  const createstorageLocation = new storageLocation({
    building,
    storageId,
    notes,
    description,
  });
  try {
    await createstorageLocation.save();
  } catch (error) {
    res.json({ message: "Error adding Storage Location", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getStorageLocation = async (req, res, next) => {
  let storageLocations;
  try {
    storageLocations = await storageLocation.find({});
  } catch (error) {
    res.json({ message: "Error finding list", error: true });
    return next(error);
  }
  res.json({
    storageLocations: storageLocations.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editStorageLocation = async (req, res, next) => {
  const { building, storageId, notes, description } = req.body;
  const { storageLocationId } = req.params;
  let storageLocationToBeEdited;
  try {
    storageLocationToBeEdited = await storageLocation.findById(
      storageLocationId
    );
  } catch (error) {
    res.json({ message: "Could not find the checked Out list", error: true });
    return next(error);
  }
  storageLocationToBeEdited.building = building;
  storageLocationToBeEdited.storageId = storageId;
  storageLocationToBeEdited.notes = notes;
  storageLocationToBeEdited.description = description;
  try {
    await storageLocationToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Storage Location", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteStorageLocation = async (req, res, next) => {
  const { storageLocationId } = req.params;
  try {
    await storageLocation.findByIdAndRemove(storageLocationId);
  } catch (error) {
    res.json({
      message: "Could not found the specific Storage Location",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addStorageLocation = addStorageLocation;
exports.getStorageLocation = getStorageLocation;
exports.editStorageLocation = editStorageLocation;
exports.deleteStorageLocation = deleteStorageLocation;
