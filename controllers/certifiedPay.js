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
const certifiedPayModel = require("../models/certifiedPayModel");
const addCertifiedPay = async (req, res, next) => {
  const {
    CP,
    active,
    generalContractor,
    frequency,
    startDate,
    jobName,
    jobNumber,
    address,
    contact,
    deliveryMethod,
  } = req.body;
  const files = req.files;
  var arr = [];
  let i = 0;
  while (i < files.length) {
    await uploadToS3(files[i])
      .then((res) => {
        arrReturn(res, arr);
      })
      .catch((err) => {
        console.log(error);
        res.json({
          message: "The size of the pictures is more than 5mb",
          error: true,
        });
      });
    i++;
  }
  const createCertifiedPay = new certifiedPayModel({
    CP,
    active,
    generalContractor,
    frequency,
    startDate,
    jobName,
    jobNumber,
    address,
    contact,
    attachments: arr,
    deliveryMethod,
  });

  try {
    await createCertifiedPay.save();
  } catch (error) {
    res.json({ message: "Error adding Certified list", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getCertifiedPay = async (req, res, next) => {
  let certifiedPays;
  try {
    certifiedPays = await certifiedPayModel.find({});
  } catch (error) {
    res.json({ message: "Error finding certified pay list", error: true });
    return next(error);
  }
  res.json({
    certifiedPays: certifiedPays.map((item) =>
      item.toObject({ getters: true }),
    ),
    error: false,
  });
};
const editCertifiedPay = async (req, res, next) => {
  const {
    CP,
    active,
    generalContractor,
    frequency,
    startDate,
    jobName,
    jobNumber,
    address,
    contact,
    deliveryMethod,
    newFileFlag,
    oldFiles,
  } = req.body;
  const { certifiedPayId } = req.params;
  const files = req.files;
  let certifiedPayToBeEdited;
  console.log("this is CP", CP);
  if (newFileFlag === "true") {
    console.log("here in new fileflag");
    var arr = [];
    const prevFileArr = JSON.parse(oldFiles);
    console.log("new fileFlag true prevFiles", prevFileArr);
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
      certifiedPayToBeEdited = await certifiedPayModel.findById(certifiedPayId);
    } catch (error) {
      res.json({ message: "Could not find the Certified Pay", error: true });
      return next(error);
    }
    console.log("this is certified", certifiedPayToBeEdited);
    certifiedPayToBeEdited.CP = CP;
    certifiedPayToBeEdited.active = active;
    certifiedPayToBeEdited.generalContractor = generalContractor;
    certifiedPayToBeEdited.frequency = frequency;
    certifiedPayToBeEdited.startDate = startDate;
    certifiedPayToBeEdited.jobName = jobName;
    certifiedPayToBeEdited.jobNumber = jobNumber;
    certifiedPayToBeEdited.address = address;
    certifiedPayToBeEdited.contact = contact;
    certifiedPayToBeEdited.deliveryMethod = deliveryMethod;
    certifiedPayToBeEdited.attachments = arr;
    try {
      await certifiedPayToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit certified pay", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const prevFileArr = JSON.parse(oldFiles);
    try {
      certifiedPayToBeEdited = await certifiedPayModel.findById(certifiedPayId);
    } catch (error) {
      res.json({ message: "Could not find the Certified Pay", error: true });
      return next(error);
    }
    certifiedPayToBeEdited.CP = CP;
    certifiedPayToBeEdited.active = active;
    certifiedPayToBeEdited.generalContractor = generalContractor;
    certifiedPayToBeEdited.frequency = frequency;
    certifiedPayToBeEdited.startDate = startDate;
    certifiedPayToBeEdited.jobName = jobName;
    certifiedPayToBeEdited.jobNumber = jobNumber;
    certifiedPayToBeEdited.address = address;
    certifiedPayToBeEdited.contact = contact;
    certifiedPayToBeEdited.deliveryMethod = deliveryMethod;
    certifiedPayToBeEdited.attachments = prevFileArr;
    try {
      await certifiedPayToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit certified pay", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const deleteCertifiedPay = async (req, res, next) => {
  const { certifiedPayId } = req.params;
  const { oldFiles } = req.body;
  const oldFilesParsed = JSON.parse(oldFiles);
  if (oldFilesParsed.length) {
    try {
      oldFilesParsed.forEach((item) => {
        deleteAwsObj(item);
      });
    } catch (error) {
      console.log(error);
      res.json({ message: "Could not find the task", error: true });
      return next(error);
    }
  }
  try {
    await certifiedPayModel.findByIdAndRemove(certifiedPayId);
  } catch (error) {
    res.json({
      message: "Could not found the specific certified pay",
      error: true,
    });
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
        res.json({
          message: "Could not Upload the file size exceeded 5mb",
          error: true,
        });
        (console.log("@@!!!!!!@#!#!@#!@#@#@!#!@# file", err), reject(err));
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
        (console.log("@@@@@!!!!!", err), reject(err));
      }
      return resolve(data);
    });
  });
};
const arrReturn = (item, arr) => {
  arr.push(item);
};
exports.addCertifiedPay = addCertifiedPay;
exports.getCertifiedPay = getCertifiedPay;
exports.editCertifiedPay = editCertifiedPay;
exports.deleteCertifiedPay = deleteCertifiedPay;
