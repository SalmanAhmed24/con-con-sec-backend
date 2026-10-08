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
const jobEstModel = require("../models/jobEstimateModel");
const addJobEstimate = async (req, res, next) => {
  const {
    RFQId,
    estimateId,
    approvalId,
    handOffId,
    jobId,
    status,
    active,
    date,
    source,
    generalContractor,
    client,
    description,
    dueDate,
    contactInfo,
  } = req.body;
  const files = req.files;
  console.log("this is body", req.body);
  var arr = [];
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
    console.log("files arr", arr);
    const createJobEstimate = new jobEstModel({
      RFQId,
      estimateId,
      approvalId,
      handOffId,
      jobId,
      status,
      active,
      date,
      source,
      generalContractor,
      client,
      description,
      dueDate,
      contactInfo,
      attachments: [{ files: arr }],
    });
    await createJobEstimate.save();
    res.json({ message: "Added Successfully", error: false });
  } catch (error) {
    res.json({ message: "Attachment Upload failed", error: true });
    return next(error);
  }
};
const getJobEstimate = async (req, res, next) => {
  let jobEstimates;
  try {
    jobEstimates = await jobEstModel.find({});
  } catch (error) {
    res.json({ message: "Error finding job Estimate list", error: true });
    return next(error);
  }
  res.json({
    jobEstimates: jobEstimates.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobEstimate = async (req, res, next) => {
  const { jobEstimateId } = req.params;
  const {
    newFileFlag,
    oldFiles,
    RFQId,
    estimateId,
    approvalId,
    handOffId,
    jobId,
    status,
    active,
    date,
    source,
    generalContractor,
    client,
    description,
    dueDate,
    contactInfo,
  } = req.body;
  const files = req.files;
  let jobEstToBeEdited;
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
      jobEstToBeEdited = await jobEstModel.findById(jobEstimateId);
    } catch (error) {
      res.json({ message: "Could not find the Data", error: true });
      return next(error);
    }
    console.log("*****", arr);
    jobEstToBeEdited.estimateId = estimateId;
    jobEstToBeEdited.approvalId = approvalId;
    jobEstToBeEdited.handOffId = handOffId;
    jobEstToBeEdited.jobId = jobId;
    jobEstToBeEdited.status = status;
    jobEstToBeEdited.active = active;
    jobEstToBeEdited.date = date;
    jobEstToBeEdited.source = source;
    jobEstToBeEdited.generalContractor = generalContractor;
    jobEstToBeEdited.client = client;
    jobEstToBeEdited.description = description;
    jobEstToBeEdited.dueDate = dueDate;
    jobEstToBeEdited.contactInfo = contactInfo;
    jobEstToBeEdited.attachments = [{ files: arr }];
    try {
      await jobEstToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit notes", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    // const prevFileArr = JSON.parse(oldFiles);
    // console.log("@@@$$$ here", prevFileArr, newFileFlag);
    try {
      jobEstToBeEdited = await jobEstModel.findById(jobEstimateId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    jobEstToBeEdited.estimateId = estimateId;
    jobEstToBeEdited.approvalId = approvalId;
    jobEstToBeEdited.handOffId = handOffId;
    jobEstToBeEdited.jobId = jobId;
    jobEstToBeEdited.status = status;
    jobEstToBeEdited.active = active;
    jobEstToBeEdited.date = date;
    jobEstToBeEdited.source = source;
    jobEstToBeEdited.generalContractor = generalContractor;
    jobEstToBeEdited.client = client;
    jobEstToBeEdited.description = description;
    jobEstToBeEdited.dueDate = dueDate;
    jobEstToBeEdited.contactInfo = contactInfo;
    try {
      await jobEstToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit job Estimates", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
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
exports.addJobEstimate = addJobEstimate;
exports.editJobEstimate = editJobEstimate;
exports.getJobEstimate = getJobEstimate;
