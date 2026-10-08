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
const serviceToolsModel = require("../models/serviceTools");
const addTools = async (req, res, next) => {
  const {
    category,
    description,
    techAssigned,
    location,
    subCategory,
    employee,
    project,
    lastPurchasePrice,
    serial,
    toolNumber,
    purchaseDate,
    warrantyExpDate,
    status,
  } = req.body;
  var arr = [];
  var alltools;
  try {
    alltools = await serviceToolsModel.find({ serial: serial });
    console.log("check for serial no exist", alltools);
    // if (alltools.length) {
    //   res.json({ message: "Duplicate Serial Number", error: true });
    // } else {
    if (req.files[0] == undefined) {
      const createserviceToolsModel = new serviceToolsModel({
        category,
        description,
        techAssigned,
        location,
        subCategory,
        employee,
        project,
        lastPurchasePrice,
        purchaseDate,
        serial,
        toolNumber,
        warrantyExpDate,
        status,
        parts: [],
        files: [],
        history: [],
      });
      try {
        await createserviceToolsModel.save();
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
      const createserviceToolsModel = new serviceToolsModel({
        category,
        description,
        techAssigned,
        location,
        subCategory,
        employee,
        project,
        lastPurchasePrice,
        purchaseDate,
        picture: { fileUrl: arr[0].fileUrl, filename: arr[0].filename },
        serial,
        toolNumber,
        status,
        parts: [],
        files: [],
        history: [],
        warrantyExpDate,
      });
      try {
        await createserviceToolsModel.save();
      } catch (error) {
        res.json({ message: "Error adding Tools", error: true });
        return next(error);
      }
      res.json({ message: "Created Successfully", error: false });
    }
    // }
  } catch (error) {
    console.log(error);
    res.json({ message: "Error in finding Tools" });
  }
};
const editTools = async (req, res, next) => {
  if (req.body.newFileFlag == "false" && req.body.editFlag == "true") {
    const {
      category,
      description,
      techAssigned,
      location,
      subCategory,
      employee,
      project,
      lastPurchasePrice,
      purchaseDate,
      pictureObj,
      status,
      serial,
      toolNumber,
      warrantyExpDate,
    } = req.body;
    const { serviceToolId } = req.params;
    let toolsToBeEdited;
    try {
      toolsToBeEdited = await serviceToolsModel.findById(serviceToolId);
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    toolsToBeEdited.category = category;
    toolsToBeEdited.status = status;
    toolsToBeEdited.description = description;
    toolsToBeEdited.techAssigned = techAssigned;
    toolsToBeEdited.location = location;
    toolsToBeEdited.subCategory = subCategory;
    toolsToBeEdited.employee = employee;
    toolsToBeEdited.project = project;
    toolsToBeEdited.lastPurchasePrice = lastPurchasePrice;
    toolsToBeEdited.purchaseDate = purchaseDate;
    toolsToBeEdited.warrantyExpDate = warrantyExpDate;
    toolsToBeEdited.picture =
      pictureObj == "undefined" || pictureObj == undefined
        ? {}
        : JSON.parse(pictureObj);
    toolsToBeEdited.serial = serial;
    toolsToBeEdited.toolNumber = toolNumber;
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
      description,
      techAssigned,
      location,
      subCategory,
      employee,
      project,
      status,
      lastPurchasePrice,
      purchaseDate,
      warrantyExpDate,
      picture,
      serial,
      toolNumber,
      oldFiles,
    } = req.body;
    var arr = [];
    try {
      console.log("oldold", oldFiles);
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

    const { serviceToolId } = req.params;
    let toolsToBeEdited;
    try {
      toolsToBeEdited = await serviceToolsModel.findById(serviceToolId);
    } catch (error) {
      res.json({ message: "Could not find the tools", error: true });
      return next(error);
    }
    toolsToBeEdited.category = category;
    toolsToBeEdited.status = status;
    toolsToBeEdited.description = description;
    toolsToBeEdited.techAssigned = techAssigned;
    toolsToBeEdited.location = location;
    toolsToBeEdited.subCategory = subCategory;
    toolsToBeEdited.employee = employee;
    toolsToBeEdited.project = project;
    toolsToBeEdited.lastPurchasePrice = lastPurchasePrice;
    toolsToBeEdited.purchaseDate = purchaseDate;
    toolsToBeEdited.warrantyExpDate = warrantyExpDate;
    if (arr[0] == undefined || arr[0].length == 0) {
      return false;
    } else {
      toolsToBeEdited.picture = arr[0];
    }
    toolsToBeEdited.serial = serial;
    toolsToBeEdited.toolNumber = toolNumber;
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
    alltools = await serviceToolsModel.find({});
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
  const { serviceToolId } = req.params;
  if (req.body.file == undefined) {
    try {
      await serviceToolsModel.findByIdAndRemove(serviceToolId);
    } catch (error) {
      res.json({ message: "Could not found the specific tool", error: true });
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
      await serviceToolsModel.findByIdAndRemove(serviceToolId);
    } catch (error) {
      res.json({ message: "Could not found the specific tool", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  }
};
const addPartsItem = async (req, res, next) => {
  console.log("here");
  const { partNo, description } = req.body;
  const { serviceToolId } = req.params;

  try {
    await serviceToolsModel.updateOne(
      { _id: serviceToolId },
      {
        $push: {
          parts: {
            partNo,
            description,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the tool", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const editPartsItem = async (req, res, next) => {
  const { partNo, description } = req.body;
  const { serviceToolId, partId } = req.params;
  try {
    userToBeEdited = await serviceToolsModel.findById(serviceToolId);
  } catch (error) {
    res.json({ message: "Could not find the tool", error: true });
    return next(error);
  }
  userToBeEdited.parts.forEach((i) => {
    if (i.id == partId) {
      i.partNo = partNo;
      i.description = description;
    }
  });
  try {
    await userToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit parts/Items", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const delPartsItem = async (req, res, next) => {
  const { serviceToolId, partId } = req.params;
  try {
    await serviceToolsModel.updateOne(
      { _id: serviceToolId },
      {
        $pull: {
          parts: { _id: partId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the tool", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
// const addInfo = async (req, res, next) => {
//   const { serviceToolId } = req.params;
//   const { subCategory, employee, project, lastPurchasePrice, picture } =
//     req.body;
//   npm;
//   let toolsToBeEdited;
//   try {
//     toolsToBeEdited = await serviceToolsModel.findById(serviceToolId);
//   } catch (error) {
//     res.json({ message: "Could not find the tool", error: true });
//     return next(error);
//   }
//   toolsToBeEdited.info.subCategory = subCategory;
//   toolsToBeEdited.info.employee = employee;
//   toolsToBeEdited.info.project = project;
//   toolsToBeEdited.info.lastPurchasePrice = lastPurchasePrice;
//   toolsToBeEdited.info.picture = picture;
//   try {
//     await toolsToBeEdited.save();
//   } catch (error) {
//     res.json({ message: "Enable to edit tools", error: true });
//     return next(error);
//   }
//   res.status(201).json({ message: "Edited successfully", error: false });
// };
// const editInfo = async (req, res, next) => {
//   const { serviceToolId } = req.params;
//   const { subCategory, employee, project, lastPurchasePrice, picture } =
//     req.body;
//   let toolsToBeEdited;
//   try {
//     toolsToBeEdited = await serviceToolsModel.findById(serviceToolId);
//   } catch (error) {
//     res.json({ message: "Could not find the tool", error: true });
//     return next(error);
//   }
//   toolsToBeEdited.info.subCategory = subCategory;
//   toolsToBeEdited.info.employee = employee;
//   toolsToBeEdited.info.project = project;
//   toolsToBeEdited.info.lastPurchasePrice = lastPurchasePrice;
//   toolsToBeEdited.info.picture = picture;
//   try {
//     await toolsToBeEdited.save();
//   } catch (error) {
//     res.json({ message: "Enable to edit tools", error: true });
//     return next(error);
//   }
//   res.status(201).json({ message: "Edited successfully", error: false });
// };

const addFiles = async (req, res, next) => {
  const { date, time, user, note } = req.body;
  const { serviceToolId } = req.params;
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
    await serviceToolsModel.updateOne(
      { _id: serviceToolId },
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
const arrReturn = (item, arr) => {
  arr.push(item);
};
const editFiles = async (req, res, next) => {
  const { serviceToolId } = req.params;
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
      userToBeEdited = await serviceToolsModel.findById(serviceToolId);
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
      userToBeEdited = await serviceToolsModel.findById(serviceToolId);
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
  const { serviceToolId, attachmentId } = req.params;
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
    await serviceToolsModel.updateOne(
      { _id: serviceToolId },
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
const addHistory = async (req, res, next) => {
  const { toolNumber, techAssigned, job, date, note, time, user, checkedOut } =
    req.body;

  var arr = [];
  let toolsToBeEdited;
  try {
    await uploadToS3(req.files[0])
      .then((res) => {
        arrReturn(res, arr);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
  try {
    toolsToBeEdited = await serviceToolsModel.findOne({
      toolNumber: toolNumber,
    });
  } catch (error) {
    res.json({ message: "Could not find the attachments", error: true });
    return next(error);
  }
  toolsToBeEdited.techAssigned = techAssigned;
  try {
    await toolsToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit tools techAssigned", error: true });
    return next(error);
  }
  try {
    await serviceToolsModel.updateOne(
      { toolNumber: toolNumber },
      {
        $push: {
          history: {
            job: job,
            file: arr[0],
            techAssigned: techAssigned,
            toolNumber: toolNumber,
            date: date,
            time: time,
            user: user,
            note: note,
            checkedOut: checkedOut,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the tools", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const getToolByNo = async (req, res, next) => {
  const { toolNo, searchValue } = req.params;
  let allTools;
  if (searchValue == "toolNo") {
    try {
      allTools = await serviceToolsModel.find({
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
      allTools = await serviceToolsModel.find({
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
      allTools = await serviceToolsModel.find({
        description: { $regex: toolNo, $options: "i" },
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
      allTools = await serviceToolsModel.find({
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
      allTools = await serviceToolsModel.find({
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
};
exports.addTools = addTools;
exports.editTools = editTools;
exports.delTools = delTools;
exports.getTools = getTools;
exports.getToolByNo = getToolByNo;
// exports.addInfo = addInfo;
// exports.editInfo = editInfo;
exports.addPartsItem = addPartsItem;
exports.editPartsItem = editPartsItem;
exports.delPartsItem = delPartsItem;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
exports.addHistory = addHistory;
