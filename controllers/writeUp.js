const writeUpModel = require("../models/writeupModel");
const dotenv = require("dotenv");
const aws = require("aws-sdk");
const momentObj = require("moment");

dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addWriteUp = async (req, res, next) => {
  const {
    dateCreated,
    createdBy,
    employeeName,
    dateAdded,
    typeOfWarning,
    typeOfOffences,
    description,
    otherOffence,
  } = req.body;
  const createwriteUpModel = new writeUpModel({
    dateCreated,
    createdBy,
    employeeName,
    dateAdded,
    typeOfWarning,
    typeOfOffences,
    description,
    otherOffence,
  });
  try {
    await createwriteUpModel.save();
  } catch (error) {
    res.json({ message: "Error adding Write Up", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getWriteUp = async (req, res, next) => {
  console.log("here");
  let writeUp;
  try {
    writeUp = await writeUpModel.find({});
  } catch (error) {
    res.json({ message: "Error finding WriteUp list", error: true });
    return next(error);
  }
  res.json({
    writeUp: writeUp.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editWriteUp = async (req, res, next) => {
  const {
    dateCreated,
    createdBy,
    employeeName,
    dateAdded,
    typeOfWarning,
    typeOfOffences,
    description,
    otherOffence,
  } = req.body;
  const { writeUpId } = req.params;
  let writeUpToBeEdited;
  try {
    writeUpToBeEdited = await writeUpModel.findById(writeUpId);
  } catch (error) {
    res.json({ message: "Could not find the writeup", error: true });
    return next(error);
  }
  writeUpToBeEdited.dateCreated = dateCreated;
  writeUpToBeEdited.createdBy = createdBy;
  writeUpToBeEdited.employeeName = employeeName;
  writeUpToBeEdited.dateAdded = dateAdded;
  writeUpToBeEdited.typeOfWarning = typeOfWarning;
  writeUpToBeEdited.typeOfOffences = typeOfOffences;
  writeUpToBeEdited.otherOffence = otherOffence;
  writeUpToBeEdited.description = description;
  try {
    await writeUpToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit writeup", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteWriteUp = async (req, res, next) => {
  const { writeUpId } = req.params;
  try {
    await writeUpModel.findByIdAndRemove(writeUpId);
  } catch (error) {
    res.json({
      message: "Could not found the specific writeup",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addSignature = async (req, res, next) => {
  const { writeUpId } = req.params;
  console.log("###", req.files);
  var arr = [];
  try {
    await uploadToS3(req.files[0])
      .then((res) => {
        arrReturn(res, arr);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
  let writeUpToBeEdited;
  try {
    writeUpToBeEdited = await writeUpModel.findById(writeUpId);
  } catch (error) {
    res.json({ message: "Could not find the WriteUp", error: true });
    return next(error);
  }
  writeUpToBeEdited.signature = {
    fileUrl: arr[0].fileUrl,
    filename: arr[0].filename,
  };
  try {
    await writeUpToBeEdited.save();
  } catch (error) {
    res.json({
      message: "Enable to edit Services",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({
    message: "Edited successfully",
    data: { fileUrl: arr[0].fileUrl, filename: arr[0].filename },
    error: false,
  });
};
const deleteSignature = async (req, res, next) => {
  const { writeUpId } = req.params;
  const { oldFiles } = req.body;
  try {
    const prevFile = JSON.parse(oldFiles);
    deleteAwsObj(prevFile);
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
  let writeUpToBeEdited;
  try {
    writeUpToBeEdited = await writeUpModel.findById(writeUpId);
  } catch (error) {
    res.json({ message: "Could not find the WriteUp`", error: true });
    return next(error);
  }
  writeUpToBeEdited.signature = {};
  try {
    await writeUpToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Services", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
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
exports.addWriteUp = addWriteUp;
exports.getWriteUp = getWriteUp;
exports.editWriteUp = editWriteUp;
exports.deleteWriteUp = deleteWriteUp;
exports.deleteSignature = deleteSignature;
exports.addSignature = addSignature;
