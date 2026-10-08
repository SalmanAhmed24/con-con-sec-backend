const jobStatusModel = require("../models/jobStatus");
const addJobStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createjobStatusModel = new jobStatusModel({
    name,
    shortCode,
  });
  try {
    await createjobStatusModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getJobStatus = async (req, res, next) => {
  let jobStatus;
  try {
    jobStatus = await jobStatusModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    jobStatus: jobStatus.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobStatus = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { jobStatusId } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await jobStatusModel.findById(jobStatusId);
  } catch (error) {
    res.json({ message: "Could not find the userType", error: true });
    return next(error);
  }
  jobToBeEdited.name = name;
  jobToBeEdited.shortCode = shortCode;
  try {
    await jobToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteJobStatus = async (req, res, next) => {
  const { jobStatusId } = req.params;
  try {
    await jobStatusModel.findByIdAndRemove(jobStatusId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addJobStatus = addJobStatus;
exports.getJobStatus = getJobStatus;
exports.editJobStatus = editJobStatus;
exports.deleteJobStatus = deleteJobStatus;
