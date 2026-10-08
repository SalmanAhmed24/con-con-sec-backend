const badgeModel = require("../models/badge");
const aws = require("aws-sdk");
const momentObj = require("moment");
const dotenv = require("dotenv");

dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addBadge = async (req, res, next) => {
  const { badge,
  badgeStatus,
  badgeType,
  employee,
  phone,
  email,
  dateIssued,
  sponsored,
  generalContractor,
  expDate,
  escorting, } = req.body;
  const createbadge = new badgeModel({
    badge,
  badgeStatus,
  badgeType,
  employee,
  phone,
  email,
  dateIssued,
  sponsored,
  generalContractor,
  escorting,
  expDate,
  });
  try {
    await createbadge.save();
  } catch (error) {
    res.json({ message: "Error adding badge", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getBadge = async (req, res, next) => {
  let badges;
  try {
    badges = await badgeModel.find({});
  } catch (error) {
    res.json({ message: "Error finding badges", error: true });
    return next(error);
  }
  res.json({
    badges: badges.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getSearchBadge = async (req, res, next) => {
   const {field,search} = req.query
  let badges;
  try {
    // if(field == "Job Number"){
    //   badges = await badgeModel.find({job:search});
    // }
    if(field == "Employee"){
      badges = await badgeModel.find({employee:search});
    }
    if(field == "Expiration"){
      badges = await badgeModel.find({expDate:search});
    }
    if(field == "Badge Type"){
      badges = await badgeModel.find({badgeType:{
            $regex: search,
            $options: "i",
          }});
    }
  } catch (error) {
    res.json({ message: "Error finding badges", error: true });
    return next(error);
  }
  res.json({
    badges: badges.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editBadge = async (req, res, next) => {
  const { badge,
  badgeStatus,
  badgeType,
  employee,
  phone,
  email,
  dateIssued,
  sponsored,
  generalContractor,
  expDate,
  escorting, } = req.body;
  const { badgeId } = req.params;
  let badgeToBeEdited;
  try {
    badgeToBeEdited = await badgeModel.findById(badgeId);
  } catch (error) {
    res.json({ message: "Could not find the badgeList", error: true });
    return next(error);
  }
  badgeToBeEdited.badge = badge;
  badgeToBeEdited.badgeStatus = badgeStatus;
  badgeToBeEdited.badgeType = badgeType;
  badgeToBeEdited.employee = employee;
  badgeToBeEdited.phone = phone;
  badgeToBeEdited.email = email;
  badgeToBeEdited.dateIssued = dateIssued;
  badgeToBeEdited.sponsored = sponsored;
  badgeToBeEdited.generalContractor = generalContractor;
  badgeToBeEdited.escorting = escorting;
  badgeToBeEdited.expDate = expDate;
  try {
    await badgeToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit badgeList", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteBadge = async (req, res, next) => {
  const { badgeId } = req.params;
  try {
    await badgeModel.findByIdAndRemove(badgeId);
  } catch (error) {
    res.json({
      message: "Could not found the specific badgeList",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const arrReturn = (item, arr) => {
  arr.push(item);
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
const addFiles = async (req, res, next) => {
  const { date, time, user, note } = req.body;
  const { badgeId } = req.params;
  console.log("this is badge Id",badgeId)
  const files = req.files;
  console.log("these are files",files)
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
    await badgeModel.updateOne(
      { _id: badgeId },
      {
        $push: {
          attachments: {
            note: note,
            date: date,
            time: time,
            user: user,
            files: arr,
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
const editFiles = async (req, res, next) => {
  const { badgeId } = req.params;
  const { note, date, time, user, id, newFileFlag, editFlag, oldFiles } =
    req.body;
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
      userToBeEdited = await badgeModel.findById(badgeId);
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
      userToBeEdited = await badgeModel.findById(badgeId);
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
const delFiles = async (req, res, next) => {
  const { badgeId, attachmentId } = req.params;
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
    await badgeModel.updateOne(
      { _id: badgeId },
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
exports.addBadge = addBadge;
exports.getBadge = getBadge;
exports.getSearchBadge = getSearchBadge;
exports.editBadge = editBadge;
exports.deleteBadge = deleteBadge;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
