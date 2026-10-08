const userModel = require("../models/userModel");
const manpowerModel = require("../models/manpowerModel");
const { syncManpowerLabor } = require("../utils/userCopies");
const fs = require("fs");
const { uploadFile, getFile } = require("../s3");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
const { verifyPassword, hashPassword, signToken } = require("../utils/auth");
dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const MIN_PASSWORD_LENGTH = 8;
const checkNewPassword = (password) => {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};
const addUser = async (req, res, next) => {
  const {
    userType,
    position,
    vehicle,
    creditCard,
    tablet,
    city,
    primaryAddress,
    secondaryAddress,
    state,
    zipcode,
    fullname,
    email,
    personalPhone,
    companyPhone,
    username,
    password,
    userStatus,
    timeTrackFlag,
  } = req.body;
  const passwordProblem = checkNewPassword(password);
  if (passwordProblem) {
    return res.json({ message: passwordProblem, error: true });
  }
  const createUserModel = new userModel({
    userType,
    position,
    vehicle,
    tablet,
    city,
    primaryAddress,
    secondaryAddress,
    state,
    zipcode,
    fullname,
    email,
    creditCard,
    personalPhone,
    companyPhone,
    username,
    password,
    userStatus,
    taskNotification: false,
    taskEmailNotification: false,
    userTasks: [],
    badges: [],
    timeTrackFlag,
  });
  try {
    await createUserModel.save();
  } catch (error) {
    res.json({ message: "Error adding User", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await userModel.find({});
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editUser = async (req, res, next) => {
  const {
    userType,
    position,
    vehicle,
    tablet,
    creditCard,
    city,
    primaryAddress,
    secondaryAddress,
    state,
    zipcode,
    fullname,
    email,
    personalPhone,
    companyPhone,
    username,
    password,
    userStatus,
    timeTrackFlag,
  } = req.body;
  const { userId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.position = position;
  userToBeEdited.vehicle = vehicle;
  userToBeEdited.tablet = tablet;
  userToBeEdited.city = city;
  userToBeEdited.fullname = fullname;
  userToBeEdited.email = email;
  userToBeEdited.personalPhone = personalPhone;
  userToBeEdited.companyPhone = companyPhone;
  userToBeEdited.username = username;
  // Only change the password when a new one is typed in. A blank field keeps
  // the current password (the API never sends the stored one to the client).
  if (typeof password === "string" && password.trim() !== "") {
    const passwordProblem = checkNewPassword(password);
    if (passwordProblem) {
      return res.json({ message: passwordProblem, error: true });
    }
    userToBeEdited.password = password; // hashed by the model's pre-save hook
  }
  userToBeEdited.userType = userType;
  userToBeEdited.creditCard = creditCard;
  userToBeEdited.primaryAddress = primaryAddress;
  userToBeEdited.secondaryAddress = secondaryAddress;
  userToBeEdited.state = state;
  userToBeEdited.zipcode = zipcode;
  userToBeEdited.userStatus = userStatus;
  userToBeEdited.timeTrackFlag = timeTrackFlag;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit user", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setTaskNotification = async (req, res, next) => {
  const { taskNotification } = req.body;
  const { userId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.taskNotification = taskNotification;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({
      message: "Enable to Change Task Notification Status",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({
    message: "Task Notification status updated successfully",
    error: false,
  });
};
const setTaskEmailNotification = async (req, res, next) => {
  const { taskEmailNotification } = req.body;
  const { userId } = req.params;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.taskEmailNotification = taskEmailNotification;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({
      message: "Enable to Change Task Email Notification Status",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({
    message: "Task Email Notification status updated successfully",
    error: false,
  });
};
const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    await userModel.findByIdAndRemove(userId);
  } catch (error) {
    res.json({ message: "Could not found the specific user", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const wrongCredentials = {
    message: "Wrong Credentials check your username or password",
    error: true,
  };
  if (typeof username !== "string" || typeof password !== "string") {
    return res.json(wrongCredentials);
  }
  let userInfo;
  try {
    userInfo = await userModel
      .findOne({ username: username })
      .select("+password");
  } catch (error) {
    console.log("login lookup failed", error.message);
    return res.status(500).json(wrongCredentials);
  }
  if (!userInfo) {
    return res.json(wrongCredentials);
  }
  const { valid, needsUpgrade } = await verifyPassword(
    password,
    userInfo.password
  );
  if (!valid) {
    return res.json(wrongCredentials);
  }
  if (needsUpgrade) {
    // Legacy plaintext password: store it as a bcrypt hash from now on.
    try {
      await userModel.updateOne(
        { _id: userInfo._id },
        { $set: { password: await hashPassword(password) } }
      );
    } catch (error) {
      console.log("password upgrade failed", error.message);
    }
  }
  let token;
  try {
    token = signToken(userInfo);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Server authentication is not configured", error: true });
  }
  res.json({
    token,
    userInfo: {
      fullname: userInfo.fullname,
      id: userInfo._id.toString(),
      userType: userInfo.userType,
      email: userInfo.email,
      taskNotification: userInfo.taskNotification,
      taskEmailNotification: userInfo.taskEmailNotification,
    },
    error: false,
  });
};
const addBadges = async (req, res, next) => {
  const { userId } = req.params;
  const {
    AISD,
    AISDExpDate,
    COAWaterDep,
    COAWaterDepExpDate,
    TFC,
    TFCExpDate,
    ABIA,
    ABIAExpDate,
  } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the unit", error: true });
    return next(error);
  }
  userToBeEdited.badges.AISD = AISD;
  userToBeEdited.badges.AISDExpDate = AISDExpDate;
  userToBeEdited.badges.COAWaterDep = COAWaterDep;
  userToBeEdited.badges.COAWaterDepExpDate = COAWaterDepExpDate;
  userToBeEdited.badges.TFC = TFC;
  userToBeEdited.badges.TFCExpDate = TFCExpDate;
  userToBeEdited.badges.ABIA = ABIA;
  userToBeEdited.badges.ABIAExpDate = ABIAExpDate;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit user", error: true });
    return next(error);
  }
  res.status(201).json({
    message: "Edited successfully",
    error: false,
    userInd: userToBeEdited,
  });
};
const editBadges = async (req, res, next) => {
  const { userId } = req.params;
  const {
    AISD,
    AISDExpDate,
    COAWaterDep,
    COAWaterDepExpDate,
    TFC,
    TFCExpDate,
    ABIA,
    ABIAExpDate,
  } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the unit", error: true });
    return next(error);
  }
  userToBeEdited.badges.AISD = AISD;
  userToBeEdited.badges.AISDExpDate = AISDExpDate;
  userToBeEdited.badges.COAWaterDep = COAWaterDep;
  userToBeEdited.badges.COAWaterDepExpDate = COAWaterDepExpDate;
  userToBeEdited.badges.TFC = TFC;
  userToBeEdited.badges.TFCExpDate = TFCExpDate;
  userToBeEdited.badges.ABIA = ABIA;
  userToBeEdited.badges.ABIAExpDate = ABIAExpDate;
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit user", error: true });
    return next(error);
  }
  res.status(201).json({
    message: "Edited successfully",
    error: false,
    userInd: userToBeEdited,
  });
};
const addNotes = async (req, res, next) => {
  const { date, time, note, user } = req.body;
  const { userId } = req.params;
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          notes: { note: note, date: date, time: time, user: user },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const editNotes = async (req, res, next) => {
  const { userId } = req.params;
  const { note, date, time, user, id } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.notes.forEach((i) => {
    if (i._id == id) {
      i.note = note;
      i.date = date;
      i.time = time;
      i.user = user;
    }
  });
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit notes", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const delNotes = async (req, res, next) => {
  const { userId, noteId } = req.params;
  console.log("this is ind id", noteId);
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          notes: { _id: noteId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const addFiles = async (req, res, next) => {
  const { date, time, user, note, attachmentCategories } = req.body;
  const { userId } = req.params;
  const files = req.files;
  var arr = [];
  try {
    let i = 0;
    let userToBeEdited;
    while (i < files.length) {
      await uploadToS3(files[i])
        .then((res) => {
          arrReturn(res, arr);
        })
        .catch((err) => console.log(err));
      i++;
    }
    await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          attachments: {
            note: note,
            date: date,
            time: time,
            user: user,
            files: arr,
            attachmentCategories: attachmentCategories,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const arrReturn = (item, arr) => {
  arr.push(item);
};
const editFiles = async (req, res, next) => {
  const { userId } = req.params;
  const {
    note,
    date,
    time,
    user,
    id,
    newFileFlag,
    editFlag,
    oldFiles,
    attachmentCategories,
  } = req.body;
  const files = req.files;
  let userToBeEdited;
  if (newFileFlag === "true") {
    console.log("here in true");
    var arr = [];
    const prevFileArr = JSON.parse(oldFiles);
    try {
      prevFileArr.forEach((item) => {
        deleteAwsObj(item);
      });
    } catch (error) {
      console.log(error);
    }
    try {
      let i = 0;
      while (i < files.length) {
        await uploadToS3(files[i])
          .then((res) => {
            arrReturn(res, arr);
          })
          .catch((err) => console.log(err));
        i++;
      }
    } catch (error) {
      console.log(error);
    }
    try {
      userToBeEdited = await userModel.findById(userId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    console.log("*****", arr);
    userToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.note = note;
        i.date = date;
        i.time = time;
        i.user = user;
        i.files = arr;
        i.attachmentCategories = attachmentCategories;
      }
    });
    try {
      await userToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit notes", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const prevFileArr = JSON.parse(oldFiles);
    console.log("@@@$$$ here", prevFileArr, newFileFlag);
    try {
      userToBeEdited = await userModel.findById(userId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    userToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.note = note;
        i.date = date;
        i.time = time;
        i.user = user;
        i.files = prevFileArr;
        i.attachmentCategories = attachmentCategories;
      }
    });
    try {
      await userToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit notes", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
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
const delFiles = async (req, res, next) => {
  const { userId, attachmentId } = req.params;
  const { oldFiles } = req.body;
  try {
    oldFiles.forEach((item) => {
      deleteAwsObj(item);
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          attachments: { _id: attachmentId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
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
const getUserByName = async (req, res, next) => {
  const { name } = req.params;
  let allUsers;
  try {
    allUsers = await userModel.find({
      fullname: { $regex: name, $options: "i" },
    });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getUserByPosition = async (req, res, next) => {
  const { position } = req.params;
  let allUsers;
  try {
    allUsers = await userModel.find({
      position: { $regex: position, $options: "i" },
    });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    allUsers: allUsers.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const addSchedule = async (req, res, next) => {
  const { date, startTime, endTime, title } = req.body;
  const { userId } = req.params;
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          schedules: {
            date: date,
            startTime: startTime,
            endTime: endTime,
            title: title,
          },
        },
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occured while adding schedule", error: true });
    return next(error);
  }
  res.json({ message: "added schedule", error: false });
};
const editSchedule = async (req, res, next) => {
  const { userId } = req.params;
  const { date, startTime, endTime, title, id } = req.body;
  let userToBeEdited;
  try {
    userToBeEdited = await userModel.findById(userId);
  } catch (error) {
    res.json({ message: "Could not find the user", error: true });
    return next(error);
  }
  userToBeEdited.schedules.forEach((i) => {
    if (i._id == id) {
      i.date = date;
      i.startTime = startTime;
      i.endTime = endTime;
      i.title = title;
    }
  });
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Schedule", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const delSchedule = async (req, res, next) => {
  const { userId, scheduleId } = req.params;
  try {
    await userModel.updateOne(
      { _id: userId },
      {
        $pull: {
          schedules: { _id: scheduleId },
        },
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ message: "Error occured while adding schedule", error: true });
    return next(error);
  }
  res.json({ message: "added schedule", error: false });
};
// Older per-role assignment endpoints (the web app now calls
// PATCH /api/manpower/assignEmployee/:id instead). They set one role on the
// manpower record and then reconcile labor entries, so calling them is safe
// and gives the same result as the new endpoint.
const assignRole = (role) => async (req, res, next) => {
  const key = role.charAt(0).toUpperCase() + role.slice(1);
  const obj = req.body[`user${key}Obj`] || {};
  const employees = (Array.isArray(obj[role]) ? obj[role] : []).map((e) => ({
    fullname: e.fullname,
  }));
  if (!obj.manpowerId) {
    return res.json({ message: "manpowerId is required", error: true });
  }
  try {
    const manpower = await manpowerModel.findById(obj.manpowerId);
    if (!manpower) {
      return res.json({ message: "Could not find the manpower", error: true });
    }
    manpower.assignedEmp[role] = { noOfEmp: employees.length, employees };
    await manpower.save();
    await syncManpowerLabor(manpower);
  } catch (error) {
    console.log("[userCopies] labor sync failed", error.message);
    return res.json({ message: "Something went wrong try again", error: true });
  }
  res.status(201).json({ message: "Assigned successfully", error: false });
};
const assignForeman = assignRole("foreman");
const assignJourneyman = assignRole("journeyman");
const assignApprentice = assignRole("apprentice");
const assignConstruction = assignRole("construction");

exports.addUser = addUser;
exports.getUsers = getUsers;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.addBadges = addBadges;
exports.editBadges = editBadges;
exports.addNotes = addNotes;
exports.editNotes = editNotes;
exports.delNotes = delNotes;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
exports.getUserByName = getUserByName;
exports.getUserByPosition = getUserByPosition;
exports.addSchedule = addSchedule;
exports.delSchedule = delSchedule;
exports.editSchedule = editSchedule;
exports.setTaskNotification = setTaskNotification;
exports.setTaskEmailNotification = setTaskEmailNotification;
exports.assignForeman = assignForeman;
exports.assignJourneyman = assignJourneyman;
exports.assignApprentice = assignApprentice;
exports.assignConstruction = assignConstruction;
