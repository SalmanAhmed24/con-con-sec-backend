const jobTypeModel = require("../models/jobTypeModel");
const addJobType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createJobTypeModel = new jobTypeModel({
    name,
    shortCode,
  });
  try {
    await createJobTypeModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getJobType = async (req, res, next) => {
  let jobTypes;
  try {
    jobTypes = await jobTypeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    jobTypes: jobTypes.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobType = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { jobTypeId } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await jobTypeModel.findById(jobTypeId);
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
const deleteJobType = async (req, res, next) => {
  const { jobTypeId } = req.params;
  try {
    await jobTypeModel.findByIdAndRemove(jobTypeId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addJobType = addJobType;
exports.getJobType = getJobType;
exports.editJobType = editJobType;
exports.deleteJobType = deleteJobType;
