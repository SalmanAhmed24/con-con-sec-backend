const toolPartModel = require("../models/toolPartModel");
const addToolPart = async (req, res, next) => {
  const { toolNumber,
      partNo,
      description} = req.body;
  const createtoolPartModel = new toolPartModel({
    toolNumber,
      partNo,
      description
  });
  try {
    await createtoolPartModel.save();
  } catch (error) {
    res.json({ message: "Error adding Tool Part", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getToolPart = async (req, res, next) => {
    const {toolNumber} = req.query
  let toolParts;
  try {
    toolParts = await toolPartModel.find({toolNumber:toolNumber});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    toolParts: toolParts.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editToolPart = async (req, res, next) => {
  const { toolNumber,
      partNo,
      description } = req.body;
  const { toolPartId } = req.params;
  let toolPartToBeEdited;
  try {
    toolPartToBeEdited = await toolPartModel.findById(toolPartId);
  } catch (error) {
    res.json({ message: "Could not find the Tool Part", error: true });
    return next(error);
  }
  toolPartToBeEdited.toolNumber = toolNumber;
  toolPartToBeEdited.partNo = partNo;
  toolPartToBeEdited.description = description;
  try {
    await toolPartToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Tool Part", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteToolPart = async (req, res, next) => {
  const { toolPartId } = req.params;
  try {
    await toolPartModel.findByIdAndRemove(toolPartId);
  } catch (error) {
    res.json({ message: "Could not found the specific Tool Part", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addToolPart = addToolPart;
exports.getToolPart = getToolPart;
exports.editToolPart = editToolPart;
exports.deleteToolPart = deleteToolPart;
