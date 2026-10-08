const toolRequestModel = require("../models/toolRequest");
const addToolRequestModel = async (req, res, next) => {
  const {
    date,
    time,
    user,
    toolRequest,
    noOfDays,
    projectVehicleFlag,
    projectDescription,
    vehicleDescription,
    dateNeededBy,
  } = req.body;
  const createtoolRequestModel = new toolRequestModel({
    date,
    time,
    user,
    toolRequest,
    noOfDays,
    projectVehicleFlag,
    projectDescription,
    vehicleDescription,
    dateNeededBy,
  });
  try {
    await createtoolRequestModel.save();
  } catch (error) {
    res.json({ message: "Error adding Tool Request list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getToolRequestModel = async (req, res, next) => {
  let toolRequestModels;
  try {
    toolRequestModels = await toolRequestModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    toolRequests: toolRequestModels.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editToolRequestModel = async (req, res, next) => {
  const {
    date,
    time,
    user,
    toolRequest,
    noOfDays,
    projectVehicleFlag,
    projectDescription,
    vehicleDescription,
    dateNeededBy,
  } = req.body;
  const { toolRequestId } = req.params;
  let toolRequestModelToBeEdited;
  try {
    toolRequestModelToBeEdited = await toolRequestModel.findById(toolRequestId);
  } catch (error) {
    res.json({ message: "Could not find the toolRequestModel", error: true });
    return next(error);
  }
  toolRequestModelToBeEdited.date = date;
  toolRequestModelToBeEdited.time = time;
  toolRequestModelToBeEdited.user = user;
  toolRequestModelToBeEdited.toolRequest = toolRequest;
  toolRequestModelToBeEdited.noOfDays = noOfDays;
  toolRequestModelToBeEdited.projectDescription = projectDescription;
  toolRequestModelToBeEdited.vehicleDescription = vehicleDescription;
  toolRequestModelToBeEdited.projectVehicleFlag = projectVehicleFlag;
  toolRequestModelToBeEdited.dateNeededBy = dateNeededBy;
  try {
    await toolRequestModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const handleToolApproval = async (req, res, next) => {
  const { approval, assignedTo } = req.body;
  console.log("This is approval", approval);
  console.log("This is assignedTo", assignedTo);
  const { toolRequestId } = req.params;
  let toolRequestModelToBeEdited;
  try {
    toolRequestModelToBeEdited = await toolRequestModel.findById(toolRequestId);
  } catch (error) {
    res.json({ message: "Could not find the toolRequestModel", error: true });
    return next(error);
  }
  toolRequestModelToBeEdited.approval = approval;
  toolRequestModelToBeEdited.assignedTo = assignedTo;
  try {
    await toolRequestModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const setStatus = async (req, res, next) => {
  const { approval, deliverTo } = req.body;
  const { toolRequestId } = req.params;
  let toolRequestModelToBeEdited;
  try {
    toolRequestModelToBeEdited = await toolRequestModel.findById(toolRequestId);
  } catch (error) {
    res.json({ message: "Could not find the toolRequestModel", error: true });
    return next(error);
  }
  if (deliverTo !== undefined) {
    toolRequestModelToBeEdited.deliverTo = deliverTo;
  }
  toolRequestModelToBeEdited.approval = approval;
  try {
    await toolRequestModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const setToolNumber = async (req, res, next) => {
  const { toolNumber } = req.body;
  const { toolRequestId } = req.params;
  let toolRequestModelToBeEdited;
  try {
    toolRequestModelToBeEdited = await toolRequestModel.findById(toolRequestId);
  } catch (error) {
    res.json({ message: "Could not find the toolRequestModel", error: true });
    return next(error);
  }

  toolRequestModelToBeEdited.toolNumber = toolNumber;
  try {
    await toolRequestModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const deleteToolRequestModel = async (req, res, next) => {
  const { toolRequestId } = req.params;
  try {
    await toolRequestModel.findByIdAndRemove(toolRequestId);
  } catch (error) {
    res.json({
      message: "Could not found the specific tool Request",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addToolRequestModel = addToolRequestModel;
exports.getToolRequestModel = getToolRequestModel;
exports.editToolRequestModel = editToolRequestModel;
exports.handleToolApproval = handleToolApproval;
exports.deleteToolRequestModel = deleteToolRequestModel;
exports.setStatus = setStatus;
exports.setToolNumber = setToolNumber;
