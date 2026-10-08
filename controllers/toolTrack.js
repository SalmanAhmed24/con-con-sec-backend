const toolTrackModel = require("../models/toolTrackModel");
const userModel = require("../models/userModel");
const { syncToolTrackCopies } = require("../utils/userCopies");
const toolsModel = require("../models/tools");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
const { ObjectId } = require("mongoose").Types;

dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addToolTrack = async (req, res, next) => {
  const {
    toolNumber,
    techAssigned,
    projectVehicleFlag,
    vehicle,
    job,
    date,
    note,
    time,
    user,
    checkedOut,
    location,
  } = req.body;
  var arr = [];
  try {
    await uploadToS3(req.files[0])
      .then((res) => {
        arrReturn(res, arr);
      })
      .catch((err) => console.log(err));
    const createToolTrack = new toolTrackModel({
      toolNumber,
      techAssigned,
      projectVehicleFlag,
      job,
      vehicle,
      date,
      note,
      time,
      user,
      checkedOut,
      location,
      file: arr[0],
    });
    await createToolTrack.save();
    console.log("techAssigned", techAssigned);
    await refreshTrackCopies([techAssigned]);
    console.log("success");
    try {
      await toolsModel.findOneAndUpdate(
        { toolNumber: `${toolNumber}` },
        {
          techAssigned: `${techAssigned}`,
          projectVehicleFlag: `${projectVehicleFlag}`,
          location: `${location}`,
          checkedOut: `${checkedOut}`,
          toolTrackDate: `${date}`,
          toolTrackTime: `${time}`,
          vehicle: `${vehicle}`,
          job: `${job}`,
        }
      );
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    res.status(201).json({ message: "added successfully", error: false });
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
};
const getToolTrack = async (req, res, next) => {
  let toolTracks;
  try {
    toolTracks = await toolTrackModel.find({}).sort({ date: 1 });
  } catch (error) {
    res.json({ message: "Error finding userType list", error: true });
    return next(error);
  }
  res.json({
    toolTracks: toolTracks.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
// Rebuild the technicians' copies (users.userToolTracks) from this
// collection. Logged, not returned, on failure: the track itself is saved and
// the copy is rebuilt on the next change or by scripts/rebuild-user-copies.js.
const refreshTrackCopies = async (names) => {
  try {
    await syncToolTrackCopies("tool", names);
  } catch (error) {
    console.log("[userCopies] tool track copy refresh failed", error.message);
  }
};
const editToolTrack = async (req, res, next) => {
  const {
    toolNumber,
    techAssigned,
    projectVehicleFlag,
    vehicle,
    job,
    date,
    note,
    time,
    user,
    checkedOut,
    location,
    oldFiles,
    newFileFlag,
    editFlag,
  } = req.body;
  const { toolTrackId } = req.params;
  if (editFlag !== "true") {
    return res.json({ message: "Nothing to edit", error: true });
  }
  let track;
  try {
    track = await toolTrackModel.findById(toolTrackId);
  } catch (error) {
    res.json({ message: "Could not find the tool track", error: true });
    return next(error);
  }
  if (!track) {
    return res.json({ message: "Could not find the tool track", error: true });
  }
  const previousTech = track.techAssigned;
  if (newFileFlag === "true" && req.files && req.files[0]) {
    try {
      if (oldFiles && oldFiles !== "undefined") {
        deleteAwsObj(JSON.parse(oldFiles)).catch((err) => console.log(err));
      }
      track.file = await uploadToS3(req.files[0]);
    } catch (error) {
      res.json({ message: "Error Occured in S3 upload", error: true });
      return next(error);
    }
  }
  track.toolNumber = toolNumber;
  track.techAssigned = techAssigned;
  track.projectVehicleFlag = projectVehicleFlag;
  track.vehicle = vehicle;
  track.job = job;
  track.date = date;
  track.note = note;
  track.time = time;
  track.user = user;
  track.checkedOut = checkedOut;
  track.location = location;
  try {
    await track.save();
  } catch (error) {
    res.json({ message: "Enable to change Location", error: true });
    return next(error);
  }
  // Keep the tool's own record pointing at its current holder/location.
  try {
    await toolsModel.findOneAndUpdate(
      { toolNumber: `${toolNumber}` },
      {
        techAssigned: `${techAssigned}`,
        location: `${location}`,
        projectVehicleFlag: `${projectVehicleFlag}`,
        checkedOut: `${checkedOut}`,
        toolTrackDate: `${date}`,
        toolTrackTime: `${time}`,
        vehicle: `${vehicle}`,
        job: `${job}`,
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the tools", error: true });
    return next(error);
  }
  // Old and new technician both need their copy rebuilt when it changes hands.
  await refreshTrackCopies([previousTech, techAssigned]);
  res.status(201).json({ message: "Edited successfully", error: false });
};
const changeLocation = async (req, res, next) => {
  let ids;
  try {
    ids = JSON.parse(req.body.data);
  } catch (error) {
    return res.json({ message: "Invalid data", error: true });
  }
  const techs = [];
  try {
    for (const toolTrackId of ids) {
      const track = await toolTrackModel.findById(toolTrackId);
      if (!track) continue;
      track.location = "Shop";
      await track.save();
      techs.push(track.techAssigned);
    }
  } catch (error) {
    res.json({ message: "Enable to change Location", error: true });
    return next(error);
  }
  await refreshTrackCopies(techs);
  res.status(201).json({ message: "Changed location successfully", error: false });
};
const deleteToolTrack = async (req, res, next) => {
  const { toolTrackId, fullname } = req.params;
  let track;
  try {
    track = await toolTrackModel.findByIdAndRemove(toolTrackId);
  } catch (error) {
    res.json({ message: "Could not found the specific tool track data", error: true });
    return next(error);
  }
  if (track && track.file && track.file.filename) {
    deleteAwsObj(track.file).catch((err) => console.log(err));
  }
  await refreshTrackCopies([track ? track.techAssigned : null, fullname]);
  res.status(201).json({ message: "Deleted successfully", error: false });
};

const uploadToS3 = (file) => {
  console.log("here in uploadS3", file);

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `js-electric-app`,
      Key: `${momentObj().format("hh:mm:ss")}-${file.originalname}`,
      Body: file.buffer,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log("@@!!!!!!@#!#!@#!@#@#@!#!@# file", err), reject(err);
      }
      const dataObj = {
        fileUrl: data.Location,
        filename: data.Key,
      };
      return resolve(dataObj);
    });
  });
};
const deleteAwsObj = async (obj) => {
  console.log("here in deleAWs", obj);
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: obj.filename,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log("@@@@@!!!!!", err), reject(err);
      }
      return resolve(data);
    });
  });
};

const arrReturn = (item, arr) => {
  arr.push(item);
};
const searchFilter = async (req, res, next) => {
  const { searchBy, searchValue } = req.query;
  var allToolTracks;
  try {
    if (searchBy == "toolNumber") {
      allToolTracks = await toolTrackModel
        .find({
          toolNumber: searchValue,
        })
        .sort({ date: -1, time: 1 });
    }
    if (searchBy == "job") {
      allToolTracks = await toolTrackModel
        .find({
          job: {
            $regex: searchValue !== undefined ? searchValue : "",
            $options: "i",
          },
        })
        .sort({ date: -1, time: 1 });
    }
    if (searchBy == "location") {
      allToolTracks = await toolTrackModel
        .find({
          location: {
            $regex: searchValue !== undefined ? searchValue : "",
            $options: "i",
          },
        })
        .sort({ date: -1, time: 1 });
    }
    if (searchBy == "techAssigned") {
      allToolTracks = await toolTrackModel
        .find({
          techAssigned: searchValue,
        })
        .sort({ date: -1, time: 1 });
    }
  } catch (error) {
    res.json({ message: "Error finding Tasks list", error: true });
    return next(error);
  }
  res.json({
    toolTracks: allToolTracks.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
exports.addToolTrack = addToolTrack;
exports.getToolTrack = getToolTrack;
exports.searchFilter = searchFilter;
exports.editToolTrack = editToolTrack;
exports.changeLocation = changeLocation;
exports.deleteToolTrack = deleteToolTrack;
