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
const trainingModel = require("../models/training");
const getTraining = async (req, res, next) => {
  let trainings;
  try {
    trainings = await trainingModel.find({});
  } catch (error) {
    res.json({ message: "Error finding training list", error: true });
    return next(error);
  }
  res.json({
    trainings: trainings.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};

const addTraining = async (req, res, next) => {
  const {
    trainingCategory,
    trainingType,
    trainingId,
    dateAdded,
    addedBy,
    title,
    description,
    videoArr,
    employeesWatched,
    assignedTo,
  status,
  } = req.body;
  const files = req.files;
  var arr = [];
  try {
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
    if (trainingType == "Picture") {
      console.log("here in picture", arr);
      const createTrainingModel = new trainingModel({
        trainingCategory,
        trainingType,
        trainingId,
        dateAdded,
        addedBy,
        title,
        description,
        attachments: arr,
        employeesWatched:[],
        assignedTo:[],
  status,
      });
      try {
        await createTrainingModel.save();
      } catch (error) {
        res.json({ message: "Error adding Tools", error: true });
        return next(error);
      }
    } else {
      const videoJson = JSON.parse(videoArr);
      const employeeJson =  employeesWatched !== undefined ? JSON.parse(employeesWatched).length == 0 ? [] : JSON.parse(employeesWatched) : []
      const assignedToJson =  assignedTo !== undefined ? JSON.parse(assignedTo).length == 0 ? [] : JSON.parse(assignedTo) : []
       
      console.log("here in video", videoJson);
      const createTrainingModel = new trainingModel({
        trainingCategory,
        trainingType,
        trainingId,
        dateAdded,
        addedBy,
        title,
        description,
        videos: videoJson,
        employeesWatched:[],
        assignedTo:[],
  status,

      });
      try {
        await createTrainingModel.save();
      } catch (error) {
        res.json({ message: "Error adding Tools", error: true });
        return next(error);
      }
    }
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }
  res.status(201).json({ message: "added successfully", error: false });
};

const editTraining = async (req, res, next) => {
  const { trainId } = req.params;
  console.log("ididid", trainId);
  const {
    trainingCategory,
    trainingType,
    trainingId,
    dateAdded,
    addedBy,
    title,
    description,
    videoArr,
    newFileFlag,
    oldFiles,
  } = req.body;
  const files = req.files;
  var trainingToBeEdited;
  if (trainingType == "Picture") {
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
        trainingToBeEdited = await trainingModel.findById(trainId);
      } catch (error) {
        res.json({ message: "Could not find the Training date", error: true });
        return next(error);
      }

      trainingToBeEdited.trainingCategory = trainingCategory;
      trainingToBeEdited.trainingType = trainingType;
      trainingToBeEdited.trainingId = trainingId;
      trainingToBeEdited.dateAdded = dateAdded;
      trainingToBeEdited.addedBy = addedBy;
      trainingToBeEdited.title = title;
      trainingToBeEdited.description = description;
      trainingToBeEdited.attachments = arr;
      
      try {
        await trainingToBeEdited.save();
      } catch (error) {
        res.json({ message: "Enable to edit training", error: true });
        return next(error);
      }
      res.status(201).json({ message: "Edited successfully", error: false });
    } else {
      const prevFileArr = JSON.parse(oldFiles);
      try {
        trainingToBeEdited = await trainingModel.findById(trainId);
      } catch (error) {
        res.json({ message: "Could not find the attachments", error: true });
        return next(error);
      }

      trainingToBeEdited.trainingCategory = trainingCategory;
      trainingToBeEdited.trainingType = trainingType;
      trainingToBeEdited.trainingId = trainingId;
      trainingToBeEdited.dateAdded = dateAdded;
      trainingToBeEdited.addedBy = addedBy;
      trainingToBeEdited.title = title;
      trainingToBeEdited.description = description;
      trainingToBeEdited.attachments = prevFileArr;
      try {
        await trainingToBeEdited.save();
      } catch (error) {
        res.json({ message: "Enable to edit training", error: true });
        return next(error);
      }
      res.status(201).json({ message: "Edited successfully", error: false });
    }
  } else {
    try {
      trainingToBeEdited = await trainingModel.findById(trainId);
    } catch (error) {
      res.json({ message: "Could not find the Training date", error: true });
      return next(error);
    }
    trainingToBeEdited.trainingCategory = trainingCategory;
    trainingToBeEdited.trainingType = trainingType;
    trainingToBeEdited.trainingId = trainingId;
    trainingToBeEdited.dateAdded = dateAdded;
    trainingToBeEdited.addedBy = addedBy;
    trainingToBeEdited.title = title;
    trainingToBeEdited.description = description;
    trainingToBeEdited.videos = JSON.parse(videoArr);
    try {
      await trainingToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit training", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const assignTraining= async (req, res, next) => {
  const { trainId } = req.params;
  console.log("ididid", trainId);
  const {
    assignedTo
  } = req.body;
  const assignedToParse = JSON.parse(assignedTo)
  var trainingToBeEdited;
  try {
        trainingToBeEdited = await trainingModel.findById(trainId);
      } catch (error) {
        res.json({ message: "Could not find the Training date", error: true });
        return next(error);
      }
      trainingToBeEdited.status = "Assigned";
      trainingToBeEdited.assignedTo = assignedToParse;
      
      try {
        await trainingToBeEdited.save();
      } catch (error) {
        res.json({ message: "Enable to edit training", error: true });
        return next(error);
      }
      res.status(201).json({ message: "Edited successfully", error: false });
};
const completeTraining= async (req, res, next) => {
  const { trainId } = req.params;
  var trainingToBeEdited;
  const {
    completedUsers
  } = req.body;
  const completedUsersParse = JSON.parse(completedUsers)
  try {
        trainingToBeEdited = await trainingModel.findById(trainId);
      } catch (error) {
        res.json({ message: "Could not find the Training date", error: true });
        return next(error);
      }
      trainingToBeEdited.status = "Completed";
      trainingToBeEdited.completedUser = completedUsersParse
      
      try {
        await trainingToBeEdited.save();
      } catch (error) {
        res.json({ message: "Enable to edit training", error: true });
        return next(error);
      }
      res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTraining = async (req, res, next) => {
  const { trainingId } = req.params;
  const { oldFiles, trainingType } = req.body;
  if (trainingType == "Video") {
    try {
      await trainingModel.findByIdAndDelete(trainingId);
    } catch (error) {
      res.json({ message: "Could not find the task", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  } else {
    try {
      oldFiles.forEach((item) => {
        deleteAwsObj(item);
      });
    } catch (error) {
      console.log(error);
      res.json({ message: "Could not find the task", error: true });
      return next(error);
    }
    try {
      await trainingModel.findByIdAndDelete(trainingId);
    } catch (error) {
      res.json({ message: "Could not find the task", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Deleted successfully", error: false });
  }
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

exports.getTraining = getTraining;
exports.addTraining = addTraining;
exports.editTraining = editTraining;
exports.assignTraining = assignTraining;
exports.completeTraining = completeTraining;
exports.deleteTraining = deleteTraining;
