const userModel = require("../models/userModel");
const { ObjectId } = require("mongoose").Types;
const moment = require("moment");
const getUsersLabors = async (req, res, next) => {
  const { jobNo } = req.params;
  let allUsers;
  try {
    allUsers = await userModel.find({ "userLabor.job": jobNo });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  var allLabors = [];
  allUsers.forEach((item) => {
    if (item.userLabor.length) {
      item.userLabor.forEach((inner) => {
        allLabors = [
          {
            userManpower: inner,
            fullname: item.fullname,
            userId: item._id,
          },
          ...allLabors,
        ];
      });
    }
  });
  res.json({
    allUserLabors: allLabors,
    error: false,
  });
};
const sameDay = (a, b) =>
  moment(a).format("MM-DD-YYYY") == moment(b).format("MM-DD-YYYY");

// Applies `change` to one user's time entry for one manpower job on one day,
// then saves. Returns false if the user or day was not found.
const updateDay = async (userId, manpowerId, date, change, { markWorking = false } = {}) => {
  const user = await userModel.findById(userId);
  if (!user) return false;
  let touched = false;
  user.userLabor.forEach((labor) => {
    if (labor.manpowerId == manpowerId) {
      if (markWorking) labor.working = true;
      labor.timeEntries.forEach((entry) => {
        if (sameDay(entry.date, date)) {
          change(entry);
          entry.dayFlag = true;
          touched = true;
        }
      });
    }
  });
  if (!touched) return false;
  await user.save();
  return true;
};

// Wraps a single-field setter in the standard request/response handling.
const daySetter = (pick, okMessage, { markWorking = false } = {}) => async (req, res) => {
  const { userId, date } = req.body;
  const { manpowerId } = req.params;
  try {
    const ok = await updateDay(userId, manpowerId, date, (entry) => pick(entry, req.body), { markWorking });
    if (!ok) {
      return res.json({ message: "Could not find that employee's day for this job", error: true });
    }
    res.json({ message: okMessage, error: false });
  } catch (error) {
    console.log(error);
    res.json({ message: "Unable to Add", error: true });
  }
};

const setCheckIn = daySetter(
  (entry, body) => {
    entry.checkedIn = body.checkInTime;
    entry.working = true;
  },
  "Added",
  { markWorking: true }
);
const editTimeTrack = daySetter(
  (entry, body) => {
    entry.checkedIn = body.checkedIn;
    entry.checkedOut = body.checkedOut;
    entry.lunchTimeStart = body.lunchTimeStart;
    entry.lunchTimeEnd = body.lunchTimeEnd;
    entry.notes = body.notes;
    entry.spectrum = body.spectrum;
    entry.reimbursal = body.reimbursal;
    entry.working = true;
  },
  "Edited Successfully",
  { markWorking: true }
);
const setCheckOut = daySetter((entry, body) => {
  entry.checkedOut = body.checkOutTime;
}, "Added");
const setLunchTime = daySetter((entry, body) => {
  entry.lunchTimeStart = body.lunchTimeStart;
  entry.lunchTimeEnd = body.lunchTimeEnd;
}, "Added");
const setNotes = daySetter((entry, body) => {
  entry.notes = body.notes;
}, "Added");
const setSpectrum = daySetter((entry, body) => {
  entry.spectrum = body.spectrum;
}, "Added");
const setReimbursal = daySetter((entry, body) => {
  entry.reimbursal = body.reimbursal;
}, "Added");

// Sets the same day's values for several employees at once. Each employee is
// loaded and saved in turn (the old version shared one variable across
// parallel saves and replied before any of them finished).
const setGroupValues = async (req, res, next) => {
  const {
    checkIn,
    checkOut,
    lunchTimeStart,
    lunchTimeEnd,
    manpowerIds,
    notes,
    reimbursal,
    userIds,
    spectrum,
    date,
  } = req.body;
  if (!Array.isArray(userIds) || !Array.isArray(manpowerIds)) {
    return res.json({ message: "userIds and manpowerIds are required", error: true });
  }
  const ids = manpowerIds.map(String);
  const failed = [];
  for (const userId of userIds) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        failed.push(userId);
        continue;
      }
      user.userLabor.forEach((labor) => {
        if (!ids.includes(String(labor.manpowerId))) return;
        labor.working = true;
        labor.timeEntries.forEach((entry) => {
          if (!sameDay(entry.date, date)) return;
          entry.lunchTimeStart = lunchTimeStart == undefined ? "" : lunchTimeStart;
          entry.lunchTimeEnd = lunchTimeEnd == undefined ? "" : lunchTimeEnd;
          entry.checkedOut = checkOut == undefined ? "" : checkOut;
          entry.checkedIn = checkIn == undefined ? "" : checkIn;
          entry.notes = notes == undefined ? "" : notes;
          entry.reimbursal = reimbursal == undefined ? [] : reimbursal;
          entry.spectrum = spectrum == undefined ? false : spectrum;
          entry.dayFlag = true;
          entry.working = true;
        });
      });
      await user.save();
    } catch (error) {
      console.log(error);
      failed.push(userId);
    }
  }
  if (failed.length) {
    return res.json({
      message: `Saved for ${userIds.length - failed.length} of ${userIds.length} employees. Please retry the rest.`,
      error: true,
      failed,
    });
  }
  res.json({ message: "Successfully Added", error: false });
};
exports.getUsersLabors = getUsersLabors;
exports.editTimeTrack = editTimeTrack;
exports.setCheckIn = setCheckIn;
exports.setCheckOut = setCheckOut;
exports.setLunchTime = setLunchTime;
exports.setGroupValues = setGroupValues;
exports.setNotes = setNotes;
exports.setReimbursal = setReimbursal;
exports.setSpectrum = setSpectrum;
