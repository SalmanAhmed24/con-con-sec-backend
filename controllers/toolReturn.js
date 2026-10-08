const toolReturnModel = require("../models/toolReturn");
const toolModel = require("../models/toolsModel");
const addtoolReturnModel = async (req, res, next) => {
  const { date, time, user, toolRequest, returnFlag } = req.body;
  const createtoolReturnModel = new toolReturnModel({
    date,
    time,
    user,
    toolRequest,
    returnFlag,
  });
  try {
    await createtoolReturnModel.save();
  } catch (error) {
    res.json({ message: "Error adding Tool Return list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const gettoolReturnModel = async (req, res, next) => {
  let toolReturnModels;
  try {
    toolReturnModels = await toolReturnModel.find({});
  } catch (error) {
    res.json({ message: "Error finding tool Return list", error: true });
    return next(error);
  }
  res.json({
    toolReturns: toolReturnModels.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const edittoolReturnModel = async (req, res, next) => {
  const { date, time, user, toolRequest, returnFlag } = req.body;
  const { toolReturnId } = req.params;
  let toolReturnModelToBeEdited;
  try {
    toolReturnModelToBeEdited = await toolReturnModel.findById(toolReturnId);
  } catch (error) {
    res.json({ message: "Could not find the toolReturnModel", error: true });
    return next(error);
  }
  toolReturnModelToBeEdited.date = date;
  toolReturnModelToBeEdited.time = time;
  toolReturnModelToBeEdited.user = user;
  toolReturnModelToBeEdited.toolRequest = toolRequest;
  toolReturnModelToBeEdited.returnFlag = returnFlag;
  try {
    await toolReturnModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setPickUpAssignee = async (req, res, next) => {
  console.log("this is called setPickup");
  const { toolRequest } = req.body;
  const { toolReturnId } = req.params;
  let toolReturnModelToBeEdited;
  try {
    toolReturnModelToBeEdited = await toolReturnModel.findById(toolReturnId);
  } catch (error) {
    res.json({ message: "Could not find the toolReturnModel", error: true });
    return next(error);
  }
  toolReturnModelToBeEdited.toolRequest = toolRequest;
  try {
    await toolReturnModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const handleToolReturn = async (req, res, next) => {
  const { returnFlag } = req.body;
  const { toolReturnId } = req.params;
  let toolReturnModelToBeEdited;
  try {
    toolReturnModelToBeEdited = await toolReturnModel.findById(toolReturnId);
  } catch (error) {
    res.json({ message: "Could not find the toolReturnModel", error: true });
    return next(error);
  }
  toolReturnModelToBeEdited.returnFlag = returnFlag;
  try {
    await toolReturnModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const handleAssignedFlag = async (req, res, next) => {
  const { assignedTo } = req.body;
  const { toolReturnId } = req.params;
  let toolReturnModelToBeEdited;
  try {
    toolReturnModelToBeEdited = await toolReturnModel.findById(toolReturnId);
  } catch (error) {
    res.json({ message: "Could not find the toolReturnModel", error: true });
    return next(error);
  }
  toolReturnModelToBeEdited.assignedTo = assignedTo;
  toolReturnModelToBeEdited.returnFlag = "Assigned To";
  try {
    await toolReturnModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const handlePickupFlag = async (req, res, next) => {
  const { toolReturnId } = req.params;
  let toolReturnModelToBeEdited;
  try {
    toolReturnModelToBeEdited = await toolReturnModel.findById(toolReturnId);
  } catch (error) {
    res.json({ message: "Could not find the toolReturnModel", error: true });
    return next(error);
  }
  toolReturnModelToBeEdited.returnFlag = "Picked Up";
  try {
    await toolReturnModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const handleReturnShop = async (req, res, next) => {
  const { toolRequest } = req.body;
  const { toolReturnId } = req.params;
  console.log("toolReq", toolRequest);
  toolRequest.forEach(async (element) => {
    try {
      const filteredTool = element.toolNumber.split("-")[0].trim();
      const updatedUser = await toolModel.findOneAndUpdate(
        { toolNumber: filteredTool },
        {
          $set: {
            techAssigned: "SHOP",
            location: `${element.location}`,
            projectVehicleFlag: "Shop",
            vehicle: "Shop",
            job: "Shop",
            project: "",
            checkedOut: 0,
          },
        },
        {
          returnDocument: "after", // Return the document after update
        }
      );

      if (!updatedUser) {
        console.log("User not found");
      } else {
        console.log(updatedUser); // The updated document
      }
    } catch (err) {
      console.error(err);
    }
  });
  let toolReturnModelToBeEdited;
  try {
    toolReturnModelToBeEdited = await toolReturnModel.findById(toolReturnId);
  } catch (error) {
    res.json({ message: "Could not find the toolReturnModel", error: true });
    return next(error);
  }
  toolReturnModelToBeEdited.toolRequest = toolRequest;
  try {
    await toolReturnModelToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Request", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const deletetoolReturnModel = async (req, res, next) => {
  const { toolReturnId } = req.params;
  try {
    await toolReturnModel.findByIdAndRemove(toolReturnId);
  } catch (error) {
    res.json({
      message: "Could not found the specific tool Request",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addtoolReturnModel = addtoolReturnModel;
exports.gettoolReturnModel = gettoolReturnModel;
exports.edittoolReturnModel = edittoolReturnModel;
exports.handleToolReturn = handleToolReturn;
exports.deletetoolReturnModel = deletetoolReturnModel;
exports.handleReturnShop = handleReturnShop;
exports.setPickUpAssignee = setPickUpAssignee;
exports.handlePickupFlag = handlePickupFlag;
exports.handleAssignedFlag = handleAssignedFlag;
