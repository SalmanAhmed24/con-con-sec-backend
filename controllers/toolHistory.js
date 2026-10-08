const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const toolHistoryModel = require("../models/toolHistory");

const addToolHistory = async (req, res, next) => {
  const {
    category,
    brand,
    techAssigned,
    toolDescription,
    description,
    projectVehicleFlag,
    job,
    vehicle,
    location,
    subCategory,
    employee,
    project,
    lastPurchasePrice,
    serial,
    toolNumber,
    purchaseDate,
    warrantyExpDate,
    status,
    picture,
    daysLeft,
    checkedOut,
    dueDate,
  } = req.body;
  const createtoolHistoryModel = new toolHistoryModel({
    category,
    brand,
    techAssigned,
    toolDescription,
    description,
    location,
    subCategory,
    projectVehicleFlag,
    job,
    vehicle,
    employee,
    project,
    lastPurchasePrice,
    purchaseDate,
    serial,
    toolNumber,
    warrantyExpDate,
    lastUpdated: momentObj(new Date()).format(),
    status,
    picture,
    daysLeft,
    checkedOut,
    dueDate,
  });
  try {
    await createtoolHistoryModel.save();
    res.json({ message: "Created Successfully", error: false });
  } catch (error) {
    res.json({ message: "Error adding Tools", error: true, error: error });
    return next(error);
  } // }
};
const editToolHistory = async (req, res, next) => {
  const {
    category,
    techAssigned,
    projectVehicleFlag,
    toolDescription,
    description,
    job,
    vehicle,
    location,
    subCategory,
    employee,
    project,
    lastPurchasePrice,
    purchaseDate,
    brand,
    status,
    serial,
    toolNumber,
    warrantyExpDate,
    picture,
    daysLeft,
    checkedOut,
    dueDate,
  } = req.body;
  const { toolHistoryId } = req.params;
  let toolsToBeEdited;
  try {
    toolsToBeEdited = await toolHistoryModel.findById(toolHistoryId);
  } catch (error) {
    res.json({ message: "Could not find the tools", error: true });
    return next(error);
  }
  toolsToBeEdited.category = category;
  toolsToBeEdited.status = status;
  toolsToBeEdited.dueDate = dueDate;
  toolsToBeEdited.toolDescription = toolDescription;
  toolsToBeEdited.description = description;
  toolsToBeEdited.techAssigned = techAssigned;
  toolsToBeEdited.location = location;
  toolsToBeEdited.subCategory = subCategory;
  toolsToBeEdited.employee = employee;
  toolsToBeEdited.projectVehicleFlag = projectVehicleFlag;
  toolsToBeEdited.job = job;
  toolsToBeEdited.vehicle = vehicle;
  toolsToBeEdited.project = project;
  toolsToBeEdited.lastPurchasePrice = lastPurchasePrice;
  toolsToBeEdited.purchaseDate = purchaseDate;
  toolsToBeEdited.warrantyExpDate = warrantyExpDate;
  toolsToBeEdited.brand = brand;
  toolsToBeEdited.picture = picture;
  toolsToBeEdited.serial = serial;
  toolsToBeEdited.toolNumber = toolNumber;
  toolsToBeEdited.lastUpdated = momentObj(new Date()).format();
  toolsToBeEdited.checkedOut = checkedOut;
  toolsToBeEdited.daysLeft = daysLeft;
  try {
    await toolsToBeEdited.save();
    res.status(201).json({ message: "Edited successfully", error: false });
  } catch (error) {
    res.json({ message: "Enable to edit tools", error: true });
    return next(error);
  }
};
const getToolHistory = async (req, res, next) => {
  let toolHistory;
  try {
    toolHistory = await toolHistoryModel.find({});
  } catch (error) {
    res.json({ message: "Error finding tools list", error: true });
    return next(error);
  }
  res.json({
    toolHistory: toolHistory.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const searchToolHistory = async (req, res, next) => {
  const { search, filterVal } = req.query;
  let toolHistory;
  try {
    if (filterVal == "Tool No") {
      toolHistory = await toolHistoryModel.find({
        toolNumber: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Location") {
      toolHistory = await toolHistoryModel.find({
        location: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Category") {
      toolHistory = await toolHistoryModel.find({
        category: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Sub-Category") {
      toolHistory = await toolHistoryModel.find({
        subCategory: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Brand") {
      toolHistory = await toolHistoryModel.find({
        brand: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Description") {
      toolHistory = await toolHistoryModel.find({
        description: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Tech Assigned") {
      toolHistory = await toolHistoryModel.find({
        techAssigned: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Project") {
      toolHistory = await toolHistoryModel.find({
        project: { $regex: search, $options: "i" },
      });
    }
    if (filterVal == "Vehicle") {
      toolHistory = await toolHistoryModel.find({
        vehicle: { $regex: search, $options: "i" },
      });
    }
  } catch (error) {
    res.json({ message: "Error finding tools list", error: true });
    return next(error);
  }
  res.json({
    toolHistory: toolHistory.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const deleteToolHistory = async (req, res, next) => {
  const { toolHistoryId } = req.params;
  try {
    await toolHistoryModel.deleteOne({ _id: toolHistoryId });
  } catch (error) {
    res.json({ message: "Could not find the tool History", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};

exports.addToolHistory = addToolHistory;
exports.editToolHistory = editToolHistory;
exports.deleteToolHistory = deleteToolHistory;
exports.getToolHistory = getToolHistory;
exports.searchToolHistory = searchToolHistory;
