const jobModel = require("../models/jobModel");
const addJob = async (req, res, next) => {
  const { jobType, jobId, client } = req.body;
  const createJobModel = new jobModel({
    jobType,
    jobId,
    client,
  });
  try {
    await createJobModel.save();
  } catch (error) {
    res.json({ message: "Error adding Job", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getJob = async (req, res, next) => {
  let jobs;
  try {
    jobs = await jobModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Jobs", error: true });
    return next(error);
  }
  res.json({
    jobs: jobs.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJob = async (req, res, next) => {
  const { jobType, jobId, client } = req.body;
  const { job_id } = req.params;
  let jobToBeEdited;
  try {
    jobToBeEdited = await jobModel.findById(job_id);
  } catch (error) {
    res.json({ message: "Could not find the job", error: true });
    return next(error);
  }
  jobToBeEdited.jobType = jobType;
  jobToBeEdited.jobId = jobId;
  jobToBeEdited.client = client;
  try {
    await jobToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit job", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteJob = async (req, res, next) => {
  const { job_id } = req.params;
  try {
    await jobModel.findByIdAndRemove(job_id);
  } catch (error) {
    res.json({ message: "Could not found the specific job", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addJob = addJob;
exports.getJob = getJob;
exports.editJob = editJob;
exports.deleteJob = deleteJob;
