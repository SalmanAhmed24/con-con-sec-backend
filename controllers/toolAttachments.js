const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const toolAttachmentsModel = require("../models/toolAttachmentsModel");
const addFiles = async (req, res, next) => {
  console.log("here in add");
  const { date, time, user, note, toolNumber } = req.body;
  const files = req.files;
  console.log(files);
  var arr = [];

  let i = 0;
  while (i < files.length) {
    await uploadToS3(files[i])
      .then((res) => {
        arrReturn(res, arr);
      })
      .catch((err) => console.log(err));
    i++;
  }
  const createToolAttachmentModel = new toolAttachmentsModel({
    note,
    date,
    time,
    user,
    toolNumber,
    lastUpdated: momentObj(new Date()).format(),
    files: arr,
  });
  try {
    await createToolAttachmentModel.save();
    res.json({ message: "Added tool attachments successfully", error: false });
  } catch (error) {
    res.json({ message: "Error adding Tools", error: true, error: error });
    return next(error);
  }
};
const arrReturn = (item, arr) => {
  arr.push(item);
};
const getFiles = async (req, res, next) => {
  const { toolNumber } = req.query;
  let attachments;
  try {
    attachments = await toolAttachmentsModel.find({ toolNumber: toolNumber });
  } catch (error) {
    res.json({ message: "Error finding tools list", error: true });
    return next(error);
  }
  res.json({
    attachments: attachments.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editFiles = async (req, res, next) => {
  const { attachmentId } = req.params;
  const { note, date, time, user, toolNumber, newFileFlag, oldFiles } =
    req.body;
  const files = req.files;
  let toolAttachmentToBeEdited;
  if (newFileFlag === "true") {
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
      toolAttachmentToBeEdited = await toolAttachmentsModel.findById(
        attachmentId
      );
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    toolAttachmentToBeEdited.note = note;
    toolAttachmentToBeEdited.date = date;
    toolAttachmentToBeEdited.time = time;
    toolAttachmentToBeEdited.user = user;
    toolAttachmentToBeEdited.toolNumber = toolNumber;
    toolAttachmentToBeEdited.files = arr;
    toolAttachmentToBeEdited.lastUpdated = momentObj(new Date()).format();

    try {
      await toolAttachmentToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit notes", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const prevFileArr = JSON.parse(oldFiles);
    try {
      toolAttachmentToBeEdited = await toolAttachmentsModel.findById(
        attachmentId
      );
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    toolAttachmentToBeEdited.note = note;
    toolAttachmentToBeEdited.date = date;
    toolAttachmentToBeEdited.time = time;
    toolAttachmentToBeEdited.user = user;
    toolAttachmentToBeEdited.toolNumber = toolNumber;
    toolAttachmentToBeEdited.files = prevFileArr;
    toolAttachmentToBeEdited.lastUpdated = momentObj(new Date()).format();

    try {
      await toolAttachmentToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const deleteAwsObj = async (obj) => {
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
  console.log("@@@@ reactive");
  const { attachmentId } = req.params;
  const { oldFiles } = req.body;
  console.log("old files", oldFiles);
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
    await toolAttachmentsModel.deleteOne({ _id: attachmentId });
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};

const uploadToS3 = (file) => {
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

exports.getFiles = getFiles;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
