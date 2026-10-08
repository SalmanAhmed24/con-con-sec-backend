const toolTransferModel = require("../models/toolTransfer");
const toolModel = require("../models/toolsModel");

const addToolTransfer = async (req, res, next) => {
  const { date, time, user, toolTransfer, returnFlag } = req.body;
  const createtoolTransferModel = new toolTransferModel({
    date,
    time,
    user,
    toolTransfer,
    returnFlag,
  });
  try {
    await createtoolTransferModel.save();
  } catch (error) {
    res.json({ message: "Error adding Tool Return list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getToolTransfer = async (req, res, next) => {
  let toolTransferModels;
  try {
    toolTransferModels = await toolTransferModel.find({});
  } catch (error) {
    res.json({ message: "Error finding tool Return list", error: true });
    return next(error);
  }
  res.json({
    toolTransfers: toolTransferModels.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editToolTransfer = async (req, res, next) => {
  const { date, time, user, toolTransfer, returnFlag } = req.body;
  const { toolTransferId } = req.params;
  let toolTransferToBeEdited;
  try {
    toolTransferToBeEdited = await toolTransferModel.findById(toolTransferId);
  } catch (error) {
    res.json({ message: "Could not find the toolTransferModel", error: true });
    return next(error);
  }
  toolTransferToBeEdited.date = date;
  toolTransferToBeEdited.time = time;
  toolTransferToBeEdited.user = user;
  toolTransferToBeEdited.toolTransfer = toolTransfer;
  toolTransferToBeEdited.returnFlag = returnFlag;
  try {
    await toolTransferToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tool Transfer", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setPickUpAssignee = async (req, res, next) => {
  console.log("this is called setPickup");
  const { toolTransfer } = req.body;
  const { toolTransferId } = req.params;
  let toolTransferToBeEdited;
  try {
    toolTransferToBeEdited = await toolTransferModel.findById(toolTransferId);
  } catch (error) {
    res.json({ message: "Could not find the toolTransferModel", error: true });
    return next(error);
  }
  toolTransferToBeEdited.toolTransfer = toolTransfer;
  try {
    await toolTransferToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tool Transfer", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const handleToolReturn = async (req, res, next) => {
  const { returnFlag } = req.body;
  const { toolTransferId } = req.params;
  let toolTransferToBeEdited;
  try {
    toolTransferToBeEdited = await toolTransferModel.findById(toolTransferId);
  } catch (error) {
    res.json({ message: "Could not find the toolTransferModel", error: true });
    return next(error);
  }
  toolTransferToBeEdited.returnFlag = returnFlag;
  try {
    await toolTransferToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Transfer", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const handleAssignedFlag = async (req, res, next) => {
  const { assignedTo } = req.body;
  const { toolTransferId } = req.params;
  let toolTransferToBeEdited;
  try {
    toolTransferToBeEdited = await toolTransferModel.findById(toolTransferId);
  } catch (error) {
    res.json({ message: "Could not find the toolTransferModel", error: true });
    return next(error);
  }
  toolTransferToBeEdited.assignedTo = assignedTo;
  toolTransferToBeEdited.returnFlag = "Assign Transfer To";
  try {
    await toolTransferToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Transfer", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const handlePickupFlag = async (req, res, next) => {
  const { toolTransferId } = req.params;
  let toolTransferToBeEdited;
  try {
    toolTransferToBeEdited = await toolTransferModel.findById(toolTransferId);
  } catch (error) {
    res.json({ message: "Could not find the toolTransferModel", error: true });
    return next(error);
  }
  toolTransferToBeEdited.returnFlag = "Transfer By";
  try {
    await toolTransferToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Transfer", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const handleReturnShop = async (req, res, next) => {
  const { toolTransfer } = req.body;
  const { toolTransferId } = req.params;
  console.log("toolReq", toolTransfer);
  toolTransfer.forEach(async (element) => {
    try {
      const filteredTool = element.toolNumber.split("-")[0].trim();
      const projectVehicle =
        element.projectVehicleFlag == "Project"
          ? "Project"
          : element.projectVehicleFlag == "Vehicle"
          ? "Vehicle"
          : "Shop";
      const updatedUser = await toolModel.findOneAndUpdate(
        { toolNumber: filteredTool },
        {
          $set: {
            techAssigned: `${element.assignedTo}`,
            projectVehicleFlag: `${projectVehicle}`,
            vehicle: `${element.vehicleDestination}`,
            job: `${element.jobDestination}`,
            project: "",
            checkedOut: element.checkedOut,
            location: `${element.location}`,
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
  let toolTransferToBeEdited;
  try {
    toolTransferToBeEdited = await toolTransferModel.findById(toolTransferId);
  } catch (error) {
    res.json({ message: "Could not find the toolTransferModel", error: true });
    return next(error);
  }
  toolTransferToBeEdited.toolTransfer = toolTransfer;
  try {
    await toolTransferToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to approve tool Transfer", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Approved successfully", error: false });
};
const deletetoolTransfer = async (req, res, next) => {
  const { toolTransferId } = req.params;
  try {
    await toolTransferModel.findByIdAndRemove(toolTransferId);
  } catch (error) {
    res.json({
      message: "Could not found the specific tool Transfer",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addToolTransfer = addToolTransfer;
exports.getToolTransfer = getToolTransfer;
exports.editToolTransfer = editToolTransfer;
exports.handleToolReturn = handleToolReturn;
exports.deletetoolTransfer = deletetoolTransfer;
exports.handleReturnShop = handleReturnShop;
exports.setPickUpAssignee = setPickUpAssignee;
exports.handlePickupFlag = handlePickupFlag;
exports.handleAssignedFlag = handleAssignedFlag;
