const manpowerModel = require("../models/manpowerModel");
const userModel = require("../models/userModel");
const { syncManpowerLabor, removeManpowerLabor } = require("../utils/userCopies");

const addManpower = async (req, res, next) => {
  const {
    job,
    PM,
    startDate,
    endDate,
    shiftStartTime,
    shiftEndTime,
    notes,
    requiredEmp,
  } = req.body;
  const createmanpowerModel = new manpowerModel({
    job,
    startDate,
    PM,
    endDate,
    shiftStartTime,
    shiftEndTime,
    notes,
    requiredEmp: {
      foreman: { noOfEmp: requiredEmp.foreman },
      journeyman: { noOfEmp: requiredEmp.journeyman },
      apprentice: { noOfEmp: requiredEmp.apprentice },
      construction: { noOfEmp: requiredEmp.construction },
    },
    assignedEmp: {
      foreman: { noOfEmp: 0, employees: [] },
      journeyman: { noOfEmp: 0, employees: [] },
      apprentice: { noOfEmp: 0, employees: [] },
      construction: { noOfEmp: 0, employees: [] },
    },
    workingEmp: {
      foreman: { noOfEmp: 0, employees: [] },
      journeyman: { noOfEmp: 0, employees: [] },
      apprentice: { noOfEmp: 0, employees: [] },
      construction: { noOfEmp: 0, employees: [] },
    },
  });
  try {
    await createmanpowerModel.save();
  } catch (error) {
    res.json({ message: "Error adding Manpower", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getManpower = async (req, res, next) => {
  let manpowers;
  try {
    manpowers = await manpowerModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Manpower list", error: true });
    return next(error);
  }
  res.json({
    manpowers: manpowers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getManpowerByJob = async (req, res, next) => {
  const { jobNumber } = req.params;
  let manpowers;
  try {
    manpowers = await manpowerModel.find({
      job: {
        $regex: jobNumber !== undefined ? jobNumber : "",
        $options: "i",
      },
    });
  } catch (error) {
    res.json({ message: "Error finding Manpower list", error: true });
    return next(error);
  }
  res.json({
    manpowers: manpowers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getManpowerByPM = async (req, res, next) => {
  const { PM } = req.params;
  let manpowers;
  try {
    manpowers = await manpowerModel.find({
      PM: {
        $regex: PM !== undefined ? PM : "",
        $options: "i",
      },
    });
  } catch (error) {
    res.json({ message: "Error finding Manpower list", error: true });
    return next(error);
  }
  res.json({
    manpowers: manpowers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getManpowerByDate = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  let manpowers;
  try {
    manpowers = await manpowerModel.find({
      startDate: {
        $gte: startDate,
      },
      endDate: {
        $lte: endDate,
      },
    });
  } catch (error) {
    res.json({ message: "Error finding Manpower list", error: true });
    return next(error);
  }
  res.json({
    manpowers: manpowers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editManpower = async (req, res, next) => {
  const {
    job,
    PM,
    startDate,
    endDate,
    requiredEmp,
    shiftEndTime,
    shiftStartTime,
    notes,
  } = req.body;
  const { manpowerId } = req.params;
  let manpowerToBeEdited;
  try {
    manpowerToBeEdited = await manpowerModel.findById(manpowerId);
  } catch (error) {
    res.json({ message: "Could not find the manpower", error: true });
    return next(error);
  }
  manpowerToBeEdited.job = job;
  manpowerToBeEdited.startDate = startDate;
  manpowerToBeEdited.endDate = endDate;
  manpowerToBeEdited.shiftStartTime = shiftStartTime;
  manpowerToBeEdited.shiftEndTime = shiftEndTime;
  manpowerToBeEdited.notes = notes;
  manpowerToBeEdited.PM = PM;
  manpowerToBeEdited.requiredEmp.foreman.noOfEmp = requiredEmp.foreman;
  manpowerToBeEdited.requiredEmp.journeyman.noOfEmp = requiredEmp.journeyman;
  manpowerToBeEdited.requiredEmp.apprentice.noOfEmp = requiredEmp.apprentice;
  manpowerToBeEdited.requiredEmp.construction.noOfEmp =
    requiredEmp.construction;
  try {
    await manpowerToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit manpower", error: true });
    return next(error);
  }
  // Push new job/dates/shift to every assigned employee's labor entry,
  // keeping the days they have already recorded.
  try {
    await syncManpowerLabor(manpowerToBeEdited);
  } catch (error) {
    console.log("[userCopies] labor sync failed", error.message);
    return res.json({
      message: "Saved, but employees' schedules could not be updated. Please try again.",
      error: true,
    });
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
// Saves who is assigned to each role and updates those employees' labor
// entries in the same request: new people get an entry, removed people lose
// theirs, and people who stay keep every hour they have already recorded.
const assignEmp = async (req, res, next) => {
  const { manpowerId } = req.params;
  let manpowerToBeEdited;
  try {
    manpowerToBeEdited = await manpowerModel.findById(manpowerId);
  } catch (error) {
    res.json({ message: "Could not find the manpower", error: true });
    return next(error);
  }
  if (!manpowerToBeEdited) {
    return res.json({ message: "Could not find the manpower", error: true });
  }
  for (const role of ["foreman", "journeyman", "apprentice", "construction"]) {
    const employees = (req.body[role] && req.body[role].employees) || [];
    manpowerToBeEdited.assignedEmp[role] = {
      noOfEmp: employees.length,
      employees,
    };
  }
  try {
    await manpowerToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit manpower", error: true });
    return next(error);
  }
  let summary;
  try {
    summary = await syncManpowerLabor(manpowerToBeEdited);
  } catch (error) {
    console.log("[userCopies] labor sync failed", error.message);
    return res.json({
      message: "Assignment saved, but employees' schedules could not be updated. Please try again.",
      error: true,
    });
  }
  res.status(201).json({ message: "Assigned successfully", error: false, summary });
};
const deleteManpower = async (req, res, next) => {
  const { manpowerId } = req.params;
  try {
    await manpowerModel.findByIdAndRemove(manpowerId);
  } catch (error) {
    res.json({ message: "Could not found the specific manpower", error: true });
    return next(error);
  }
  // Remove this job's labor entries from every user, found on the server
  // rather than trusting the list sent by the browser.
  try {
    await removeManpowerLabor(manpowerId);
  } catch (error) {
    console.log("[userCopies] labor cleanup failed", error.message);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addManpower = addManpower;
exports.getManpower = getManpower;
exports.assignEmp = assignEmp;
exports.editManpower = editManpower;
exports.deleteManpower = deleteManpower;
exports.getManpowerByJob = getManpowerByJob;
exports.getManpowerByPM = getManpowerByPM;
exports.getManpowerByDate = getManpowerByDate;
