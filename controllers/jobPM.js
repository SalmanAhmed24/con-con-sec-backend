const jobPMModel = require("../models/jobPM");
const addJobPM = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createJobPMModel = new jobPMModel({
    name,
    shortCode,
  });
  try {
    await createJobPMModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getJobPM = async (req, res, next) => {
  let jobPMs;
  try {
    jobPMs = await jobPMModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    jobPMs: jobPMs.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobPM = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { jobPMId } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await jobPMModel.findById(jobPMId);
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
const deleteJobPM = async (req, res, next) => {
  const { jobPMId } = req.params;
  try {
    await jobPMModel.findByIdAndRemove(jobPMId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addJobPM = addJobPM;
exports.getJobPM = getJobPM;
exports.editJobPM = editJobPM;
exports.deleteJobPM = deleteJobPM;
