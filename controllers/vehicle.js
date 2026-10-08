const vehicleModel = require("../models/vehicle");
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
const addVehicle = async (req, res, next) => {
  const {
    vehicleNo,
    driverWEXPin,
    email,
    vinNo,
    tagExperation,
    licensePlate,
    makeModel,
    color,
    year,
    txTag,
    gasCard,
    gasCardLast,
    cardNo,
    trackingInstalled,
    geoTab,
    enterpriseId,
    status,
  } = req.body;
  const createVehicleModel = new vehicleModel({
    vehicleNo,
    driverWEXPin,
    email,
    vinNo,
    tagExperation,
    licensePlate,
    makeModel,
    color,
    year,
    txTag,
    gasCard,
    gasCardLast,
    cardNo,
    trackingInstalled,
    geoTab,
    enterpriseId,
    status,
  });
  try {
    await createVehicleModel.save();
  } catch (error) {
    res.json({ message: "Error adding Vehicle", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getVehicle = async (req, res, next) => {
  let vehicles;
  try {
    vehicles = await vehicleModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Vehicle list", error: true });
    return next(error);
  }
  res.json({
    vehicles: vehicles.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editVehicle = async (req, res, next) => {
  const {
    vehicleNo,
    driverWEXPin,
    email,
    vinNo,
    tagExperation,
    licensePlate,
    makeModel,
    color,
    year,
    txTag,
    gasCard,
    gasCardLast,
    cardNo,
    trackingInstalled,
    geoTab,
    enterpriseId,
    status,
  } = req.body;
  const { vehicleId } = req.params;
  let vehicleToBeEdited;
  try {
    vehicleToBeEdited = await vehicleModel.findById(vehicleId);
  } catch (error) {
    res.json({ message: "Could not find the device", error: true });
    return next(error);
  }
  vehicleToBeEdited.vehicleNo = vehicleNo;
  vehicleToBeEdited.driverWEXPin = driverWEXPin;
  vehicleToBeEdited.vinNo = vinNo;
  vehicleToBeEdited.tagExperation = tagExperation;
  vehicleToBeEdited.licensePlate = licensePlate;
  vehicleToBeEdited.makeModel = makeModel;
  vehicleToBeEdited.color = color;
  vehicleToBeEdited.year = year;
  vehicleToBeEdited.txTag = txTag;
  vehicleToBeEdited.gasCard = gasCard;
  vehicleToBeEdited.gasCardLast = gasCardLast;
  vehicleToBeEdited.cardNo = cardNo;
  vehicleToBeEdited.trackingInstalled = trackingInstalled;
  vehicleToBeEdited.geoTab = geoTab;
  vehicleToBeEdited.email = email;
  vehicleToBeEdited.enterpriseId = enterpriseId;
  vehicleToBeEdited.status = status;
  try {
    await vehicleToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit vehicle", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteVehicle = async (req, res, next) => {
  const { vehicleId } = req.params;
  try {
    await vehicleModel.findByIdAndRemove(vehicleId);
  } catch (error) {
    res.json({ message: "Could not found the specific vehicle", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addFiles = async (req, res, next) => {
  const { date, time, user, note, attachmentCategories } = req.body;
  const { vehicleId } = req.params;
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
    await vehicleModel.updateOne(
      { _id: vehicleId },
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
  const { vehicleId } = req.params;
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
      userToBeEdited = await vehicleModel.findById(vehicleId);
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
      userToBeEdited = await vehicleModel.findById(vehicleId);
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
  const { vehicleId, attachmentId } = req.params;
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
    await vehicleModel.updateOne(
      { _id: vehicleId },
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
exports.addVehicle = addVehicle;
exports.getVehicle = getVehicle;
exports.editVehicle = editVehicle;
exports.deleteVehicle = deleteVehicle;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
