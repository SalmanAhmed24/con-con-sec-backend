const devicesModel = require("../models/devices");
const addDevice = async (req, res, next) => {
  const {
    category,
    billingAccount,
    phoneNo,
    username,
    make,
    upgradeDate,
    usageLastMonth,
  } = req.body;
  const createDeviceModel = new devicesModel({
    category,
    billingAccount,
    phoneNo,
    username,
    make,
    upgradeDate,
    usageLastMonth,
  });
  try {
    await createDeviceModel.save();
  } catch (error) {
    res.json({ message: "Error adding Device", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getDevice = async (req, res, next) => {
  let devices;
  try {
    devices = await devicesModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Device list", error: true });
    return next(error);
  }
  res.json({
    devices: devices.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editDevice = async (req, res, next) => {
  console.log("###", req.body);
  const {
    category,
    billingAccount,
    phoneNo,
    username,
    make,
    upgradeDate,
    usageLastMonth,
  } = req.body;
  const { deviceId } = req.params;
  let deviceToBeEdited;
  try {
    deviceToBeEdited = await devicesModel.findById(deviceId);
  } catch (error) {
    res.json({ message: "Could not find the device", error: true });
    return next(error);
  }
  deviceToBeEdited.category = category;
  deviceToBeEdited.billingAccount = billingAccount;
  deviceToBeEdited.phoneNo = phoneNo;
  deviceToBeEdited.username = username;
  deviceToBeEdited.make = make;
  deviceToBeEdited.upgradeDate = upgradeDate;
  deviceToBeEdited.usageLastMonth = usageLastMonth;
  try {
    await deviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit device", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteDevice = async (req, res, next) => {
  const { deviceId } = req.params;
  try {
    await devicesModel.findByIdAndRemove(deviceId);
  } catch (error) {
    res.json({ message: "Could not found the specific device", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addDevice = addDevice;
exports.getDevice = getDevice;
exports.editDevice = editDevice;
exports.deleteDevice = deleteDevice;
