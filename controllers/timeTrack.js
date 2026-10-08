const timeTrackModel = require("../models/timeTrack");
const moment = require("moment");
const addTimeTrack = async (req, res, next) => {
  const {
    employee,
    jobDescription,
    jobNumber,
    phase,
    dateAdded,
    timeAdded,
    date,
    hours,
    laborType,
    notes,
    startTime,
    endTime,
    lunch,
    spectrum,
    user,
    lunchTime,
    reimbursalFlag,
    reimbursal,
    timeTrackFlag,
  } = req.body;
  const createTimeTrackModel = new timeTrackModel({
    employee,
    jobDescription,
    jobNumber,
    timeTrackFlag,
    phase,
    dateAdded,
    timeAdded,
    date,
    hours,
    laborType,
    notes,
    startTime,
    endTime,
    spectrum,
    user,
    lunch,
    lunchTime,
    reimbursalFlag,
    reimbursal,
  });
  console.log("#$#$#$#", reimbursal);
  try {
    await createTimeTrackModel.save();
  } catch (error) {
    res.json({ message: "Error adding Time Track", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTimeTrack = async (req, res, next) => {
  // const { startDate, endDate, spectrum } = req.query;
  const { startDate, endDate, perPage, page, spectrum } = req.query;
  console.log(req.query);
  if (
    (startDate !== "" || endDate !== "") &&
    (startDate !== undefined || endDate !== undefined)
  ) {
    var timeTracks;
    var timeTracksCount;
    if (spectrum !== "" && spectrum !== undefined) {
      if (
        moment(startDate).format("MM/DD/YYYY") ==
        moment(endDate).format("MM/DD/YYYY")
      ) {
        console.log("here");
        try {
          console.log("####");
          timeTracksCount = await timeTrackModel
            .find({
              date: {
                $regex: moment(startDate).format("YYYY-MM-DD"),
                $options: "i",
              },
              spectrum: spectrum,
            })
            .count();
          timeTracks = await timeTrackModel
            .find({
              date: {
                $regex: moment(startDate).format("YYYY-MM-DD"),
                $options: "i",
              },
              spectrum: spectrum,
            })
            .sort([["date", -1]])
            .limit(parseInt(perPage))
            .skip((page - 1) * perPage);
        } catch (error) {
          res.json({ message: "Error finding time Track", error: true });
          return next(error);
        }
        res.json({
          timeTracks: timeTracks.map((item) =>
            item.toObject({ getters: true })
          ),
          error: false,
          count: timeTracksCount,
        });
      } else {
        try {
          timeTracksCount = await timeTrackModel
            .find({
              date: {
                $gte: moment(startDate).format(),
                $lte: moment(endDate).format(),
              },
              spectrum: spectrum,
            })
            .count();
          timeTracks = await timeTrackModel
            .find({
              date: {
                $gte: moment(startDate).format(),
                $lte: moment(endDate).format(),
              },
              spectrum: spectrum,
            })
            .sort([["date", -1]])
            .limit(parseInt(perPage))
            .skip((page - 1) * perPage);
        } catch (error) {
          res.json({ message: "Error finding time Track", error: true });
          return next(error);
        }
        res.json({
          timeTracks: timeTracks.map((item) =>
            item.toObject({ getters: true })
          ),
          error: false,
          count: timeTracksCount,
        });
      }
    } else {
      if (
        moment(startDate).format("MM/DD/YYYY") ==
        moment(endDate).format("MM/DD/YYYY")
      ) {
        console.log("here");
        try {
          console.log("####");
          timeTracksCount = await timeTrackModel
            .find({
              date: {
                $regex: moment(startDate).format("YYYY-MM-DD"),
                $options: "i",
              },
            })
            .count();
          timeTracks = await timeTrackModel
            .find({
              date: {
                $regex: moment(startDate).format("YYYY-MM-DD"),
                $options: "i",
              },
            })
            .sort([["date", -1]])
            .limit(parseInt(perPage))
            .skip((page - 1) * perPage);
        } catch (error) {
          res.json({ message: "Error finding time Track", error: true });
          return next(error);
        }
        res.json({
          timeTracks: timeTracks.map((item) =>
            item.toObject({ getters: true })
          ),
          error: false,
          count: timeTracksCount,
        });
      } else {
        try {
          timeTracksCount = await timeTrackModel
            .find({
              date: {
                $gte: moment(startDate).format(),
                $lte: moment(endDate).format(),
              },
            })
            .count();
          timeTracks = await timeTrackModel
            .find({
              date: {
                $gte: moment(startDate).format(),
                $lte: moment(endDate).format(),
              },
            })
            .sort([["date", -1]])
            .limit(parseInt(perPage))
            .skip((page - 1) * perPage);
        } catch (error) {
          res.json({ message: "Error finding time Track", error: true });
          return next(error);
        }
        res.json({
          timeTracks: timeTracks.map((item) =>
            item.toObject({ getters: true })
          ),
          error: false,
          count: timeTracksCount,
        });
      }
    }
  } else {
    console.log("here in no filter");
    if (spectrum !== "" && spectrum !== undefined) {
      console.log("here in spec filter");
      let timeTracks;
      var timeTracksCount;
      try {
        timeTracksCount = await timeTrackModel
          .find({ spectrum: spectrum })
          .count();
        timeTracks = await timeTrackModel
          .find({ spectrum: spectrum })
          .sort([["date", -1]])
          .limit(parseInt(perPage))
          .skip((page - 1) * perPage);
      } catch (error) {
        res.json({ message: "Error finding time Track", error: true });
        return next(error);
      }
      res.json({
        timeTracks: timeTracks.map((item) => item.toObject({ getters: true })),
        error: false,
        count: timeTracksCount,
      });
    } else {
      let timeTracks;
      var timeTracksCount;
      try {
        timeTracksCount = await timeTrackModel.find({}).count();
        timeTracks = await timeTrackModel
          .find({})
          .sort([["date", -1]])
          .limit(parseInt(perPage))
          .skip((page - 1) * perPage);
      } catch (error) {
        res.json({ message: "Error finding time Track", error: true });
        return next(error);
      }
      res.json({
        timeTracks: timeTracks.map((item) => item.toObject({ getters: true })),
        error: false,
        count: timeTracksCount,
      });
    }
  }
};
const editTimeTrack = async (req, res, next) => {
  const {
    employee,
    jobDescription,
    jobNumber,
    phase,
    date,
    hours,
    laborType,
    startTime,
    endTime,
    spectrum,
    user,
    notes,
    lunch,
    lunchTime,
    reimbursalFlag,
    reimbursal,
    timeTrackFlag,
  } = req.body;
  const { timeTrackId } = req.params;
  let timeTrackToBeEdited;
  try {
    timeTrackToBeEdited = await timeTrackModel.findById(timeTrackId);
  } catch (error) {
    res.json({ message: "Could not find the timeTrack", error: true });
    return next(error);
  }
  timeTrackToBeEdited.employee = employee;
  timeTrackToBeEdited.jobDescription = jobDescription;
  timeTrackToBeEdited.jobNumber = jobNumber;
  timeTrackToBeEdited.phase = phase;
  timeTrackToBeEdited.date = date;
  timeTrackToBeEdited.hours = hours;
  timeTrackToBeEdited.laborType = laborType;
  timeTrackToBeEdited.notes = notes;
  timeTrackToBeEdited.startTime = startTime;
  timeTrackToBeEdited.endTime = endTime;
  timeTrackToBeEdited.spectrum = spectrum;
  timeTrackToBeEdited.user = user;
  timeTrackToBeEdited.lunch = lunch;
  timeTrackToBeEdited.lunchTime = lunchTime;
  timeTrackToBeEdited.reimbursalFlag = reimbursalFlag;
  timeTrackToBeEdited.reimbursal = reimbursal;
  timeTrackToBeEdited.timeTrackFlag = timeTrackFlag;

  try {
    await timeTrackToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit time Track", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTimeTrack = async (req, res, next) => {
  const { timeTrackId } = req.params;
  try {
    await timeTrackModel.findByIdAndRemove(timeTrackId);
  } catch (error) {
    res.json({
      message: "Could not found the specific time track",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const getByEmp = async (req, res, next) => {
  const { search } = req.params;
  const { perPage, page, spectrum, ownFlag, searchSelect } = req.query;
  console.log("spec", spectrum);
  console.log("search Select", searchSelect);
  if (spectrum !== "" && spectrum !== undefined) {
    console.log("spec if");
    if (searchSelect == "Employee") {
      let allTimeTrack;
      let allTimeTrackCount;
      try {
        allTimeTrackCount = await timeTrackModel
          .find({
            employee: { $regex: search, $options: "i" },
            spectrum: spectrum,
          })
          .count();
        allTimeTrack = await timeTrackModel
          .find({
            employee: { $regex: search, $options: "i" },
            spectrum: spectrum,
          })
          .sort([["date", -1]])
          .limit(parseInt(perPage))
          .skip((page - 1) * perPage);
      } catch (error) {
        res.json({ message: "Error finding time track list", error: true });
        return next(error);
      }
      res.json({
        timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
        error: false,
        count: allTimeTrackCount,
      });
    }
    if (searchSelect == "Job Number") {
      console.log("I am here in job Number");
      let allTimeTrack;
      let allTimeTrackCount;
      try {
        allTimeTrackCount = await timeTrackModel
          .find({
            jobNumber: { $regex: search, $options: "i" },
            spectrum: spectrum,
          })
          .count();
        allTimeTrack = await timeTrackModel
          .find({
            jobNumber: { $regex: search, $options: "i" },
            spectrum: spectrum,
          })
          .sort([["date", -1]])
          .limit(parseInt(perPage))
          .skip((page - 1) * perPage);
      } catch (error) {
        res.json({ message: "Error finding time track list", error: true });
        return next(error);
      }
      res.json({
        timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
        error: false,
        count: allTimeTrackCount,
      });
    }
  } else {
    console.log("spec else");
    if (ownFlag == "false") {
      let allTimeTrack;
      let allTimeTrackCount;
      try {
        allTimeTrackCount = await timeTrackModel
          .find({ user: { $regex: search, $options: "i" } })
          .count();

        allTimeTrack = await timeTrackModel
          .find({ user: { $regex: search, $options: "i" } })
          .sort([["date", -1]])
          .limit(parseInt(perPage))
          .skip((page - 1) * perPage);
      } catch (error) {
        res.json({ message: "Error finding time track list", error: true });
        return next(error);
      }
      res.json({
        timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
        error: false,
        count: allTimeTrackCount,
      });
    } else if (ownFlag == "true") {
      console.log("here in true");
      let allTimeTrack;
      let allTimeTrackCount;
      try {
        allTimeTrackCount = await timeTrackModel
          .find({ employee: { $regex: search, $options: "i" } })
          .count();
        allTimeTrack = await timeTrackModel
          .find({ employee: { $regex: search, $options: "i" } })
          .sort([["date", -1]])
          .limit(parseInt(perPage))
          .skip((page - 1) * perPage);
      } catch (error) {
        res.json({ message: "Error finding time track list", error: true });
        return next(error);
      }
      res.json({
        timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
        error: false,
        count: allTimeTrackCount,
      });
    }
  }
};
const getDataByJob = async (req, res, next) => {
  const { jobDescription } = req.params;
  const { perPage, page, spectrum } = req.query;
  if (spectrum !== "" && spectrum !== undefined) {
    let allTimeTrack;
    let allTimeTrackCount;
    try {
      allTimeTrackCount = await timeTrackModel
        .find({
          jobDescription: { $regex: jobDescription, $options: "i" },
          spectrum: spectrum,
        })
        .count();
      allTimeTrack = await timeTrackModel
        .find({
          jobDescription: { $regex: jobDescription, $options: "i" },
          spectrum: spectrum,
        })
        .sort([["date", -1]])
        .limit(parseInt(perPage))
        .skip((page - 1) * perPage);
    } catch (error) {
      res.json({ message: "Error finding users list", error: true });
      return next(error);
    }
    res.json({
      timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
      error: false,
      count: allTimeTrackCount,
    });
  } else {
    let allTimeTrack;
    let allTimeTrackCount;
    try {
      allTimeTrackCount = await timeTrackModel
        .find({
          jobDescription: { $regex: jobDescription, $options: "i" },
        })
        .count();
      allTimeTrack = await timeTrackModel
        .find({
          jobDescription: { $regex: jobDescription, $options: "i" },
        })
        .sort([["date", -1]])
        .limit(parseInt(perPage))
        .skip((page - 1) * perPage);
    } catch (error) {
      res.json({ message: "Error finding users list", error: true });
      return next(error);
    }
    res.json({
      timeTrack: allTimeTrack.map((item) => item.toObject({ getters: true })),
      error: false,
      count: allTimeTrackCount,
    });
  }
};
exports.addTimeTrack = addTimeTrack;
exports.getTimeTrack = getTimeTrack;
exports.editTimeTrack = editTimeTrack;
exports.deleteTimeTrack = deleteTimeTrack;
exports.getByEmp = getByEmp;
exports.getDataByJob = getDataByJob;
