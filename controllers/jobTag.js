const jobTagModel = require("../models/jobTagModel");
const addJobTag = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createJobTagModel = new jobTagModel({
    name,
    shortCode,
  });
  try {
    await createJobTagModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getJobTag = async (req, res, next) => {
  let jobTags;
  try {
    jobTags = await jobTagModel.find({});
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    jobTags: jobTags.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobTag = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { jobTagId } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await jobTagModel.findById(jobTagId);
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
const deleteJobTag = async (req, res, next) => {
  const { jobTagId } = req.params;
  try {
    await jobTagModel.findByIdAndRemove(jobTagId);
  } catch (error) {
    res.json({ message: "Could not found the specific userType", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addJobTag = addJobTag;
exports.getJobTag = getJobTag;
exports.editJobTag = editJobTag;
exports.deleteJobTag = deleteJobTag;
