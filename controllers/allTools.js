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
const toolsModel = require("../models/toolsModel");

const addTools = async (req, res, next) => {
  const {
    category,
    brand,
    files,
    techAssigned,
    toolDescription,
    projectVehicleFlag,
    job,
    vehicle,
    location,
    subCategory,
    employee,
    project,
    daysLeft,
    lastPurchasePrice,
    serial,
    toolNumber,
    purchaseDate,
    warrantyExpDate,
    status,
    checkedOut,
    dueDate,
  } = req.body;
  var parsedFiles = JSON.parse(files);
  try {
    const createToolsModel = new toolsModel({
      category,
      techAssigned,
      projectVehicleFlag,
      job,
      vehicle,
      location,
      subCategory,
      toolDescription,

      brand,
      employee,
      project,
      lastPurchasePrice,
      purchaseDate,
      picture: parsedFiles,
      serial,
      toolNumber,
      lastUpdated: new Date(),
      status,
      warrantyExpDate,
      checkedOut,
      daysLeft,
      dueDate,
    });
    try {
      await createToolsModel.save();
    } catch (error) {
      res.json({ message: "Error adding Tools", error: true, error: error });
      return next(error);
    }
    res.json({ message: "Created Successfully", error: false });
    // }
  } catch (error) {
    console.log(error);
    res.json({ message: "Error in finding Tools" });
  }
};
const editTools = async (req, res, next) => {
  console.log("new File Flag", req.body.newFileFlag);
  console.log("edit Flag", req.body.editFlag);
  if (req.body.newFileFlag == "false" && req.body.editFlag == "true") {
    const {
      category,
      techAssigned,
      projectVehicleFlag,
      toolDescription,
      job,
      vehicle,
      location,
      subCategory,
      employee,
      project,
      lastPurchasePrice,
      purchaseDate,
      files,
      brand,
      status,
      serial,
      toolNumber,
      warrantyExpDate,
      checkedOut,
      daysLeft,
      dueDate,
    } = req.body;
    console.log("I should be here", JSON.parse(files));

    const { toolId } = req.params;
    let toolsToBeEdited;
    try {
      toolsToBeEdited = await toolsModel.findById(toolId);
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    toolsToBeEdited.category = category;
    toolsToBeEdited.status = status;
    toolsToBeEdited.toolDescription = toolDescription;
    toolsToBeEdited.techAssigned = techAssigned;
    toolsToBeEdited.location = location;
    toolsToBeEdited.subCategory = subCategory;
    toolsToBeEdited.employee = employee;
    toolsToBeEdited.projectVehicleFlag = projectVehicleFlag;
    toolsToBeEdited.job = job;
    toolsToBeEdited.vehicle = vehicle;
    toolsToBeEdited.project = project;
    toolsToBeEdited.lastPurchasePrice = lastPurchasePrice;
    toolsToBeEdited.purchaseDate = purchaseDate;
    toolsToBeEdited.warrantyExpDate = warrantyExpDate;
    toolsToBeEdited.brand = brand;
    toolsToBeEdited.checkedOut = checkedOut;
    toolsToBeEdited.dueDate = dueDate;
    toolsToBeEdited.picture =
      JSON.parse(files).length == 0 ? [] : JSON.parse(files);
    toolsToBeEdited.serial = serial;
    toolsToBeEdited.toolNumber = toolNumber;
    toolsToBeEdited.lastUpdated = new Date();
    toolsToBeEdited.daysLeft = daysLeft;
    try {
      await toolsToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit tools", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const {
      category,
      techAssigned,
      projectVehicleFlag,
      toolDescription,
      job,
      vehicle,
      location,
      subCategory,
      employee,
      brand,
      project,
      status,
      lastPurchasePrice,
      purchaseDate,
      warrantyExpDate,
      serial,
      toolNumber,
      oldFiles,
      files,
      checkedOut,
      daysLeft,
      dueDate,
    } = req.body;
    var parsedOldFiles = oldFiles.length ? JSON.parse(oldFiles) : [];
    var parsedNewFiles = files.length
      ? JSON.parse(files).map((i) => {
          return { fileUrl: i.fileUrl, filename: i.filename };
        })
      : [];
    console.log("##$$$## new files", parsedNewFiles);
    console.log("##$$$## old files", parsedOldFiles);
    try {
      if (parsedOldFiles.length == 0) {
        console.log("here");
      } else {
        parsedOldFiles.map(async (i) => {
          await deleteAwsObj(i);
        });
      }
    } catch (error) {
      res.json({ message: "Error deleting S3 image", error: true });
      return next(error);
    }
    const { toolId } = req.params;
    let toolsToBeEdited;
    try {
      toolsToBeEdited = await toolsModel.findById(toolId);
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    toolsToBeEdited.category = category;
    toolsToBeEdited.status = status;
    toolsToBeEdited.dueDate = dueDate;
    toolsToBeEdited.toolDescription = toolDescription;
    toolsToBeEdited.techAssigned = techAssigned;
    toolsToBeEdited.projectVehicleFlag = projectVehicleFlag;
    toolsToBeEdited.job = job;
    toolsToBeEdited.vehicle = vehicle;
    toolsToBeEdited.location = location;
    toolsToBeEdited.subCategory = subCategory;
    toolsToBeEdited.employee = employee;
    toolsToBeEdited.project = project;
    toolsToBeEdited.lastPurchasePrice = lastPurchasePrice;
    toolsToBeEdited.purchaseDate = purchaseDate;
    toolsToBeEdited.brand = brand;
    toolsToBeEdited.checkedOut = checkedOut;
    toolsToBeEdited.warrantyExpDate = warrantyExpDate;
    if (parsedNewFiles.length == 0) {
      return false;
    } else {
      toolsToBeEdited.picture = parsedNewFiles;
    }
    toolsToBeEdited.serial = serial;
    toolsToBeEdited.toolNumber = toolNumber;
    toolsToBeEdited.lastUpdated = new Date();
    toolsToBeEdited.daysLeft = daysLeft;
    try {
      await toolsToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit tools", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const getTools = async (req, res, next) => {
  let alltools;
  try {
    alltools = await toolsModel.find({});
  } catch (error) {
    res.json({ message: "Error finding tools list", error: true });
    return next(error);
  }
  res.json({
    allTools: alltools.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const delTools = async (req, res, next) => {
  const { toolId } = req.params;
  var file = JSON.parse(req.body.file);
  if (file.length == 0) {
    try {
      await toolsModel.findByIdAndRemove(toolId);
    } catch (error) {
      res.json({ message: "Could not found the specific tool", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  } else {
    console.log(file);
    try {
      file.map(async (i) => {
        await deleteAwsObj(i);
      });
    } catch (error) {
      res.json({ message: "Error deleting S3 image", error: true });
      return next(error);
    }
    try {
      await toolsModel.findByIdAndRemove(toolId);
    } catch (error) {
      res.json({ message: "Could not found the specific tool", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  }
};
const arrReturn = (item, arr) => {
  arr.push(item);
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

const findSerial = async (req, res, next) => {
  const { serial } = req.params;
  if (serial == "null") {
    res.json({ error: false });
  } else {
    let allTools = [];
    allTools = await toolsModel.find({ serial: serial });
    if (allTools.length) {
      res.json({ message: "Duplicate Serial Number", error: true });
    } else {
      res.json({ error: false });
    }
  }
};
const getToolByNo = async (req, res, next) => {
  const { toolNo, searchValue } = req.params;
  let allTools;
  if (searchValue == "toolNo") {
    try {
      allTools = await toolsModel.find({
        toolNumber: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
  if (searchValue == "serialNo") {
    try {
      allTools = await toolsModel.find({
        serial: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
  if (searchValue == "description") {
    try {
      allTools = await toolsModel.find({
        toolDescription: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
  if (searchValue == "techAssigned") {
    try {
      allTools = await toolsModel.find({
        techAssigned: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
  if (searchValue == "location") {
    try {
      allTools = await toolsModel.find({
        location: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
  if (searchValue == "brand") {
    try {
      allTools = await toolsModel.find({
        brand: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
  if (searchValue == "Job") {
    try {
      allTools = await toolsModel.find({
        job: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }

  if (searchValue == "Vehicle") {
    try {
      allTools = await toolsModel.find({
        vehicle: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
  if (searchValue == "Category") {
    try {
      allTools = await toolsModel.find({
        category: { $regex: toolNo, $options: "i" },
      });
    } catch (error) {
      res.json({ message: "Error finding tools list", error: true });
      return next(error);
    }
    res.json({
      allTools: allTools.map((item) => item.toObject({ getters: true })),
      error: false,
    });
  }
};
const uploadPictures = async (req, res, next) => {
  const file = req.files[0];
  var arr = [];
  try {
    await uploadToS3(file)
      .then((response) => {
        arrReturn(response, arr);
        res.json({ file: arr, error: false });
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
};
const deletePictures = async (req, res, next) => {
  const { edit, file, id, remainingFiles } = req.body;
  if (edit) {
    try {
      deleteAwsObj(file);
      res.json({ message: "File deleted successfully", error: false });
    } catch (error) {
      res.json({ message: "Error deleting S3 image", error: true });
      return next(error);
    }
    let toolsToBeEdited;
    try {
      toolsToBeEdited = await toolsModel.findById(id);
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    toolsToBeEdited.picture = remainingFiles;
    try {
      await toolsToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit tools", error: true });
      return next(error);
    }
  } else {
    try {
      deleteAwsObj(file);
      res.json({ message: "File deleted successfully", error: false });
    } catch (error) {
      res.json({ message: "Error deleting S3 image", error: true });
      return next(error);
    }
  }
};
exports.addTools = addTools;
exports.editTools = editTools;
exports.findSerial = findSerial;
exports.delTools = delTools;
exports.getTools = getTools;
exports.getToolByNo = getToolByNo;
exports.uploadPictures = uploadPictures;
exports.deletePictures = deletePictures;
