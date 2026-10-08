const jobSourcesModel = require("../models/jobSources");
const addJobSources = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createJobSourcesModel = new jobSourcesModel({
    name,
    shortCode,
  });
  try {
    await createJobSourcesModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getJobSources = async (req, res, next) => {
  let jobSources;
  try {
    jobSources = await jobSourcesModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    jobSources: jobSources.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobSources = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { jobSourcesId } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await jobSourcesModel.findById(jobSourcesId);
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
const deleteJobSources = async (req, res, next) => {
  const { jobSourcesId } = req.params;
  try {
    await jobSourcesModel.findByIdAndRemove(jobSourcesId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addJobSources = addJobSources;
exports.getJobSources = getJobSources;
exports.editJobSources = editJobSources;
exports.deleteJobSources = deleteJobSources;
