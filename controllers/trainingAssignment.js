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
const trainingAssignmentModel = require("../models/trainingAssignment");
const getTrainingAssignments = async (req, res, next) => {
  let trainingAssignments;
  try {
    trainingAssignments = await trainingAssignmentModel.find({});
  } catch (error) {
    res.json({ message: "Error finding training list", error: true });
    return next(error);
  }
  res.json({
    trainingAssignments: trainingAssignments.map((item) =>
      item.toObject({ getters: true }),
    ),
    error: false,
  });
};

const addTrainingAssignments = async (req, res, next) => {
  const {
    trainingCategory,
    trainingType,
    trainingId,
    assignedTo,
    completedUser,
    status,
    dateAssigned,
    notes,
  } = req.body;
  console.log("req", req.body);
  const createtrainingAssignmentModel = new trainingAssignmentModel({
    trainingCategory,
    trainingType,
    trainingId,
    assignedTo: JSON.parse(assignedTo),
    completedUser: [],
    status,
    dateAssigned,
    notes,
  });
  try {
    await createtrainingAssignmentModel.save();
    res.status(201).json({ message: "added successfully", error: false });
  } catch (error) {
    res.json({ message: "Error adding Tools", error: true });
    return next(error);
  }
};

const editTrainingAssignment = async (req, res, next) => {
  const { trainAssignmentId } = req.params;
  const {
    trainingCategory,
    trainingType,
    trainingId,
    assignedTo,
    completedUser,
    status,
    dateAssigned,
    notes,
  } = req.body;
  var trainingToBeEdited;
  try {
    trainingToBeEdited =
      await trainingAssignmentModel.findById(trainAssignmentId);
  } catch (error) {
    res.json({ message: "Could not find the Training date", error: true });
    return next(error);
    trainingToBeEdited.trainingCategory = trainingCategory;
    trainingToBeEdited.trainingType = trainingType;
    trainingToBeEdited.trainingId = trainingId;
    trainingToBeEdited.dateAssigned = dateAssigned;
    trainingToBeEdited.notes = notes;
    trainingToBeEdited.assignedTo = JSON.parse(assignedTo);
    trainingToBeEdited.completedUser = JSON.parse(completedUser);
    trainingToBeEdited.status = status;

    try {
      await trainingToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit training", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
// const assignTraining= async (req, res, next) => {
//   const { trainAssignmentId } = req.params;
//   const {
//     assignedTo,
//     dateAssigned,
//     notes
//   } = req.body;
//   const assignedToParse = JSON.parse(assignedTo)
//   var trainingToBeEdited;
//   try {
//         trainingToBeEdited = await trainingAssignmentModel.findById(trainAssignmentId);
//       } catch (error) {
//         res.json({ message: "Could not find the Training date", error: true });
//         return next(error);
//       }
//       trainingToBeEdited.status = "Assigned";
//       trainingToBeEdited.assignedTo = assignedToParse;
//       trainingToBeEdited.dateAssigned = dateAssigned;
//       trainingToBeEdited.dateAssigned = dateAssigned;

//       try {
//         await trainingToBeEdited.save();
//       } catch (error) {
//         res.json({ message: "Enable to edit training", error: true });
//         return next(error);
//       }
//       res.status(201).json({ message: "Edited successfully", error: false });
// };
const completeTraining = async (req, res, next) => {
  const { trainAssignmentId } = req.params;
  var trainingToBeEdited;
  const { completedUsers } = req.body;
  const completedUsersParse = JSON.parse(completedUsers);
  try {
    trainingToBeEdited =
      await trainingAssignmentModel.findById(trainAssignmentId);
  } catch (error) {
    res.json({ message: "Could not find the Training date", error: true });
    return next(error);
  }
  trainingToBeEdited.status = "Completed";
  trainingToBeEdited.completedUser = completedUsersParse;

  try {
    await trainingToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit training", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTraining = async (req, res, next) => {
  const { trainAssignmentId } = req.params;
  try {
    await trainingAssignmentModel.findByIdAndDelete(trainAssignmentId);
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};

exports.getTrainingAssignments = getTrainingAssignments;
exports.addTrainingAssignments = addTrainingAssignments;
exports.editTrainingAssignment = editTrainingAssignment;
// exports.assignTraining = assignTraining;
exports.completeTraining = completeTraining;
exports.deleteTraining = deleteTraining;
