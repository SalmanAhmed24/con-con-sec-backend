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
const toolDamageModel = require("../models/toolDamageModel");
const addtoolDamage = async (req, res, next) => {
  const {
    category,
    user,
    currentDate,
    subCategory,
    description,
    location,
    serial,
    toolNumber,
  } = req.body;
  var arr = [];
  console.log("@@@", req.files, req);
  var alltoolDamages;
  try {
    // if (alltools.length) {
    //   res.json({ message: "Duplicate Serial Number", error: true });
    // } else {
    if (req.files[0] == undefined) {
      const createtoolDamageModel = new toolDamageModel({
        category,
        subCategory,
        description,
        location,
        serial,
        user,
        currentDate,
        toolNumber,
      });
      try {
        await createtoolDamageModel.save();
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
      const createtoolDamageModel = new toolDamageModel({
        category,
        subCategory,
        description,
        location,
        serial,
        user,
        toolNumber,
        currentDate,
        picture: { fileUrl: arr[0].fileUrl, filename: arr[0].filename },
      });
      try {
        await createtoolDamageModel.save();
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
const edittoolDamage = async (req, res, next) => {
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
      toolNumber,
    } = req.body;
    const { toolDamageId } = req.params;
    let toolDamageToBeEdited;
    try {
      toolDamageToBeEdited = await toolDamageModel.findById(toolDamageId);
    } catch (error) {
      res.json({ message: "Could not find the need Tag", error: true });
      return next(error);
    }
    toolDamageToBeEdited.category = category;
    toolDamageToBeEdited.description = description;
    toolDamageToBeEdited.location = location;
    toolDamageToBeEdited.subCategory = subCategory;
    toolDamageToBeEdited.user = user;
    toolDamageToBeEdited.currentDate = currentDate;
    toolDamageToBeEdited.toolNumber = toolNumber;
    toolDamageToBeEdited.picture =
      pictureObj == "undefined" || pictureObj == undefined
        ? {}
        : JSON.parse(pictureObj);
    toolDamageToBeEdited.serial = serial;
    try {
      await toolDamageToBeEdited.save();
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
      toolNumber,
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

    const { toolDamageId } = req.params;
    let toolDamageToBeEdited;
    try {
      toolDamageToBeEdited = await toolDamageModel.findById(toolDamageId);
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    toolDamageToBeEdited.category = category;
    toolDamageToBeEdited.description = description;
    toolDamageToBeEdited.location = location;
    toolDamageToBeEdited.subCategory = subCategory;
    toolDamageToBeEdited.user = user;
    toolDamageToBeEdited.currentDate = currentDate;
    toolDamageToBeEdited.toolNumber = toolNumber;
    if (arr[0] == undefined || arr[0].length == 0) {
      return false;
    } else {
      toolDamageToBeEdited.picture = arr[0];
    }
    toolDamageToBeEdited.serial = serial;
    try {
      await toolDamageToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit need Tag", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const gettoolDamages = async (req, res, next) => {
  let alltoolDamages;
  try {
    alltoolDamages = await toolDamageModel.find({});
  } catch (error) {
    res.json({ message: "Error finding need Tag list", error: true });
    return next(error);
  }
  res.json({
    alltoolDamages: alltoolDamages.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const deltoolDamage = async (req, res, next) => {
  const { toolDamageId } = req.params;
  if (req.body.file == undefined) {
    try {
      await toolDamageModel.findByIdAndRemove(toolDamageId);
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
      await toolDamageModel.findByIdAndRemove(toolDamageId);
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
exports.addtoolDamage = addtoolDamage;
exports.edittoolDamage = edittoolDamage;
exports.deltoolDamage = deltoolDamage;
exports.gettoolDamage = gettoolDamages;
