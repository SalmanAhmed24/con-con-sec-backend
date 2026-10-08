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
const needTagModel = require("../models/needTagModel");
const addNeedTag = async (req, res, next) => {
  const {
    category,
    user,
    currentDate,
    subCategory,
    description,
    location,
    serial,
  } = req.body;
  var arr = [];
  console.log("@@@", req.files, req);
  var allNeedTags;
  try {
    // if (alltools.length) {
    //   res.json({ message: "Duplicate Serial Number", error: true });
    // } else {
    if (req.files[0] == undefined) {
      const createNeedTagModel = new needTagModel({
        category,
        subCategory,
        description,
        location,
        serial,
        user,
        currentDate,
      });
      try {
        await createNeedTagModel.save();
      } catch (error) {
        res.json({ message: "Error adding Tools", error: true });
        return next(error);
      }
      res.json({ message: "Created Successfully", error: false });
    } else {
      try {
        await uploadToS3(req.files[0])
          .then((res) => {
            arrReturn(res, arr);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        res.json({ message: "Error Occured in S3 upload", error: true });
      }
      const createNeedTagModel = new needTagModel({
        category,
        subCategory,
        description,
        location,
        serial,
        user,
        currentDate,
        picture: { fileUrl: arr[0].fileUrl, filename: arr[0].filename },
      });
      try {
        await createNeedTagModel.save();
      } catch (error) {
        res.json({ message: "Error adding Need Tag Data", error: true });
        return next(error);
      }
      res.json({ message: "Created Successfully", error: false });
    }
    // }
  } catch (error) {
    console.log(error);
    res.json({ message: "Error in finding Need Tag duplicate serial# found" });
  }
};
const editNeedTag = async (req, res, next) => {
  if (req.body.newFileFlag == "false" && req.body.editFlag == "true") {
    const {
      category,
      description,
      location,
      subCategory,
      pictureObj,
      serial,
      user,
      currentDate,
    } = req.body;
    const { needTagId } = req.params;
    let needTagToBeEdited;
    try {
      needTagToBeEdited = await needTagModel.findById(needTagId);
    } catch (error) {
      res.json({ message: "Could not find the need Tag", error: true });
      return next(error);
    }
    needTagToBeEdited.category = category;
    needTagToBeEdited.description = description;
    needTagToBeEdited.location = location;
    needTagToBeEdited.subCategory = subCategory;
    needTagToBeEdited.user = user;
    needTagToBeEdited.currentDate = currentDate;
    needTagToBeEdited.picture =
      pictureObj == "undefined" || pictureObj == undefined
        ? {}
        : JSON.parse(pictureObj);
    needTagToBeEdited.serial = serial;
    try {
      await needTagToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit Need Tag data", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const {
      category,
      description,
      location,
      subCategory,
      picture,
      currentDate,
      user,
      serial,
      oldFiles,
    } = req.body;
    var arr = [];
    try {
      if (oldFiles == "undefined") {
        console.log("here in undefined");
      } else {
        const prevFile = JSON.parse(oldFiles);
        deleteAwsObj(prevFile);
      }
    } catch (error) {
      res.json({ message: "Error deleting S3 image", error: true });
      return next(error);
    }
    try {
      if (req.files[0] == undefined || req.files[0].length == 0) {
        return false;
      } else {
        await uploadToS3(req.files[0])
          .then((res) => {
            arrReturn(res, arr);
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      res.json({ message: "Error Occured in S3 upload", error: true });
      return next(error);
    }

    const { needTagId } = req.params;
    let needTagToBeEdited;
    try {
      needTagToBeEdited = await needTagModel.findById(needTagId);
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    needTagToBeEdited.category = category;
    needTagToBeEdited.description = description;
    needTagToBeEdited.location = location;
    needTagToBeEdited.subCategory = subCategory;
    needTagToBeEdited.user = user;
    needTagToBeEdited.currentDate = currentDate;
    if (arr[0] == undefined || arr[0].length == 0) {
      return false;
    } else {
      needTagToBeEdited.picture = arr[0];
    }
    needTagToBeEdited.serial = serial;
    try {
      await needTagToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit need Tag", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const getNeedTags = async (req, res, next) => {
  let allNeedTags;
  try {
    allNeedTags = await needTagModel.find({});
  } catch (error) {
    res.json({ message: "Error finding need Tag list", error: true });
    return next(error);
  }
  res.json({
    allNeedTags: allNeedTags.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const delNeedTag = async (req, res, next) => {
  const { needTagId } = req.params;
  if (req.body.file == undefined) {
    try {
      await needTagModel.findByIdAndRemove(needTagId);
    } catch (error) {
      res.json({
        message: "Could not found the specific Need Tag",
        error: true,
      });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  } else {
    try {
      deleteAwsObj(JSON.parse(req.body.file));
    } catch (error) {
      res.json({ message: "Error deleting S3 image", error: true });
      return next(error);
    }
    try {
      await needTagModel.findByIdAndRemove(needTagId);
    } catch (error) {
      res.json({
        message: "Could not found the specific need Tag",
        error: true,
      });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
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
exports.addNeedTag = addNeedTag;
exports.editNeedTag = editNeedTag;
exports.delNeedTag = delNeedTag;
exports.getNeedTag = getNeedTags;
