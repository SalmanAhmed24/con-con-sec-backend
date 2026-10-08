const jobCTMModel = require("../models/jobCTM");
const addJobCTM = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createJobCTMModel = new jobCTMModel({
    name,
    shortCode,
  });
  try {
    await createJobCTMModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getJobCTM = async (req, res, next) => {
  let jobCTMs;
  try {
    jobCTMs = await jobCTMModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    jobCTMs: jobCTMs.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobCTM = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { jobCTMId } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await jobCTMModel.findById(jobCTMId);
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
const deleteJobCTM = async (req, res, next) => {
  const { jobCTMId } = req.params;
  try {
    await jobCTMModel.findByIdAndRemove(jobCTMId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addJobCTM = addJobCTM;
exports.getJobCTM = getJobCTM;
exports.editJobCTM = editJobCTM;
exports.deleteJobCTM = deleteJobCTM;
