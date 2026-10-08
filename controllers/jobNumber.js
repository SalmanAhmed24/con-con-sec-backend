const moment = require("moment");
const jobNumber = require("../models/jobNumber");
const jobNumberModel = require("../models/jobNumber");

const addJobNumber = async (req, res, next) => {
  const {
    jobNumber,
    jobName,
    initials,
    generalContractor,
    contractTM,
    amount,
    PO,
    CO,
    percentageBilled,
    notes,
    projectChecklist,
    dateCreated,
    dateBilled,
    jobPM,
    QBW,
    PAY,
  } = req.body;
  const createJobNumber = new jobNumberModel({
    jobNumber,
    jobName,
    initials,
    generalContractor,
    contractTM,
    amount,
    PO,
    CO,
    percentageBilled,
    notes,
    projectChecklist,
    dateCreated,
    dateBilled,
    jobPM,
    QBW,
    PAY,
  });
  try {
    await createJobNumber.save();
  } catch (error) {
    res.json({ message: "Error adding Job Number", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
// const addJobNumber = async (req, res, next) => {
//   const {
//     jobTag,
//     number,
//     jobPM,
//     jobName,
//     client,
//     dateCreated,
//     dateBilled,
//     jobCTM,
//     amount,
//     POContract,
//     changeOrder,
//     percentageBilled,
//     notes,
//     generalContractor,
//   } = req.body;
//   const createJobNumber = new jobNumberModel({
//     jobTag,
//     number,
//     jobPM,
//     jobName,
//     client,
//     dateCreated,
//     dateBilled,
//     jobCTM,
//     amount,
//     POContract,
//     changeOrder,
//     percentageBilled,
//     notes,
//     generalContractor,
//   });
//   try {
//     await createJobNumber.save();
//   } catch (error) {
//     res.json({ message: "Error adding Job Number", error: true });
//     return next(error);
//   }
//   res.json({ message: "Created Successfully", error: false });
// };
const getJobNumber = async (req, res, next) => {
  const { jobTag, jobPM, client, jobNumber, page, perPage } = req.query;
  if (jobNumber !== undefined && jobNumber !== "") {
    console.log("here in job", jobNumber);
    let jobNumbers;
    let jobNumberCount;
    try {
      jobNumberCount = await jobNumberModel
        .find({
          jobNumber: {
            $regex: jobNumber !== undefined ? jobNumber : "",
            $options: "i",
          },
        })
        .count();
      jobNumbers = await jobNumberModel
        .find({
          jobNumber: {
            $regex: jobNumber !== undefined ? jobNumber : "",
            $options: "i",
          },
        })
        .skip(perPage * page)
        .limit(perPage);
    } catch (error) {
      res.json({ message: "Error finding Tasks list", error: true });
      return next(error);
    }
    res.json({
      jobNumbers: jobNumbers.map((item) => item.toObject({ getters: true })),
      error: false,
      totalCount: jobNumberCount,
    });
  } else if (client !== "" && client !== undefined) {
    console.log("here in client", client);
    let jobNumbers;
    let jobNumberCount;
    try {
      jobNumberCount = await jobNumberModel
        .find({
          generalContractor: {
            $regex: client !== undefined ? client : "",
            $options: "i",
          },
        })
        .count();
      jobNumbers = await jobNumberModel
        .find({
          generalContractor: {
            $regex: client !== undefined ? client : "",
            $options: "i",
          },
        })
        .skip(perPage * page)
        .limit(perPage);
    } catch (error) {
      res.json({ message: "Error finding Tasks list", error: true });
      return next(error);
    }
    res.json({
      jobNumbers: jobNumbers.map((item) => item.toObject({ getters: true })),
      error: false,
      totalCount: jobNumberCount,
    });
  } else if (jobPM !== undefined && jobPM !== "") {
    console.log("here in jobPM", jobPM);
    let jobNumbers;
    let jobNumberCount;
    try {
      jobNumberCount = await jobNumberModel
        .find({
          jobPM: {
            $regex: jobPM !== undefined ? jobPM : "",
            $options: "i",
          },
        })
        .count();
      jobNumbers = await jobNumberModel
        .find({
          jobPM: {
            $regex: jobPM !== undefined ? jobPM : "",
            $options: "i",
          },
        })
        .skip(perPage * page)
        .limit(perPage);
    } catch (error) {
      res.json({ message: "Error finding Tasks list", error: true });
      return next(error);
    }
    res.json({
      jobNumbers: jobNumbers.map((item) => item.toObject({ getters: true })),
      error: false,
      totalCount: jobNumberCount,
    });
  } else {
    let jobNumbers;
    let jobNumberCount;
    if (page == 0 && perPage == 0) {
      try {
        jobNumberCount = await jobNumberModel.find({}).count();
        jobNumbers = await jobNumberModel.find({});
      } catch (error) {
        res.json({
          message: "Error finding Job Number list",
          error: true,
          totalCount: jobNumberCount,
        });
        return next(error);
      }
      res.json({
        jobNumbers: jobNumbers.map((item) => item.toObject({ getters: true })),
        error: false,
        totalCount: jobNumberCount,
      });
    } else {
      try {
        jobNumberCount = await jobNumberModel.find({}).count();
        jobNumbers = await jobNumberModel
          .find({})
          .skip(perPage * page)
          .limit(perPage);
      } catch (error) {
        res.json({
          message: "Error finding Job Number list",
          error: true,
          totalCount: jobNumberCount,
        });
        return next(error);
      }
      res.json({
        jobNumbers: jobNumbers.map((item) => item.toObject({ getters: true })),
        error: false,
        totalCount: jobNumberCount,
      });
    }
  }
};
const getASCJobNumber = async (req, res, next) => {
  const { sortBy, ascFlag, page, perPage } = req.query;
  console.log("sortBy", sortBy);
  try {
    jobNumberCount = await jobNumberModel.find({}).count();
    jobNumbers = await jobNumberModel.find({});
  } catch (error) {
    res.json({
      message: "Error finding Job Number list",
      error: true,
      totalCount: jobNumberCount,
    });
    return next(error);
  }
  if (sortBy == "jobNumber") {
    res.json({
      jobNumbers:
        ascFlag == "false"
          ? jobNumbers
              .sort((a, b) => Number(a.jobNumber) - Number(b.jobNumber))
              .map((item) => item.toObject({ getters: true }))
          : jobNumbers
              .sort((a, b) => Number(b.jobNumber) - Number(a.jobNumber))
              .map((item) => item.toObject({ getters: true })),
      error: false,
      totalCount: jobNumberCount,
    });
  }
  if (sortBy == "jobName") {
    res.json({
      jobNumbers:
        ascFlag == "false"
          ? jobNumbers
              .sort((a, b) => a.jobName.localeCompare(b.jobName))
              .map((item) => item.toObject({ getters: true }))
          : jobNumbers
              .sort((a, b) => b.jobName.localeCompare(a.jobName))
              .map((item) => item.toObject({ getters: true })),
      error: false,
      totalCount: jobNumberCount,
    });
  }
  if (sortBy == "client") {
    res.json({
      jobNumbers:
        ascFlag == "false"
          ? jobNumbers
              .sort((a, b) =>
                a.generalContractor.localeCompare(b.generalContractor)
              )
              .map((item) => item.toObject({ getters: true }))
          : jobNumbers
              .sort((a, b) =>
                b.generalContractor.localeCompare(a.generalContractor)
              )
              .map((item) => item.toObject({ getters: true })),
      error: false,
      totalCount: jobNumberCount,
    });
  }
  if (sortBy == "jobPM") {
    res.json({
      jobNumbers:
        ascFlag == "false"
          ? jobNumbers
              .sort((a, b) => a.jobPM.localeCompare(b.jobPM))
              .map((item) => item.toObject({ getters: true }))
          : jobNumbers
              .sort((a, b) => b.jobPM.localeCompare(a.jobPM))
              .map((item) => item.toObject({ getters: true })),
      error: false,
      totalCount: jobNumberCount,
    });
  }
};
const editJobNumber = async (req, res, next) => {
  const {
    jobNumber,
    jobName,
    initials,
    generalContractor,
    contractTM,
    amount,
    PO,
    CO,
    percentageBilled,
    notes,
    projectChecklist,
    dateCreated,
    dateBilled,
    jobPM,
    QBW,
    PAY,
  } = req.body;
  const { jobNumberId } = req.params;
  let jobNoToBeEdited;
  try {
    jobNoToBeEdited = await jobNumberModel.findById(jobNumberId);
  } catch (error) {
    res.json({ message: "Could not find job Number", error: true });
    return next(error);
  }
  jobNoToBeEdited.jobNumber = jobNumber;
  jobNoToBeEdited.jobName = jobName;
  jobNoToBeEdited.initials = initials;
  jobNoToBeEdited.generalContractor = generalContractor;
  jobNoToBeEdited.contractTM = contractTM;
  jobNoToBeEdited.amount = amount;
  jobNoToBeEdited.PO = PO;
  jobNoToBeEdited.CO = CO;
  jobNoToBeEdited.percentageBilled = percentageBilled;
  jobNoToBeEdited.notes = notes;
  jobNoToBeEdited.projectChecklist = projectChecklist;
  jobNoToBeEdited.dateCreated = dateCreated;
  jobNoToBeEdited.dateBilled = dateBilled;
  jobNoToBeEdited.jobPM = jobPM;
  jobNoToBeEdited.QBW = QBW;
  jobNoToBeEdited.PAY = PAY;
  try {
    await jobNoToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit job Number", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
// const editJobNumber = async (req, res, next) => {
//   const {
//     jobTag,
//     number,
//     jobPM,
//     jobName,
//     client,
//     dateCreated,
//     dateBilled,
//     jobCTM,
//     amount,
//     POContract,
//     changeOrder,
//     percentageBilled,
//     notes,
//     generalContractor,
//   } = req.body;
//   const { jobNumberId } = req.params;
//   let jobNoToBeEdited;
//   try {
//     jobNoToBeEdited = await jobNumberModel.findById(jobNumberId);
//   } catch (error) {
//     res.json({ message: "Could not find job Number", error: true });
//     return next(error);
//   }
//   jobNoToBeEdited.jobTag = jobTag;
//   jobNoToBeEdited.number = number;
//   jobNoToBeEdited.jobPM = jobPM;
//   jobNoToBeEdited.jobName = jobName;
//   jobNoToBeEdited.client = client;
//   jobNoToBeEdited.dateCreated = dateCreated;
//   jobNoToBeEdited.dateBilled = dateBilled;
//   jobNoToBeEdited.jobCTM = jobCTM;
//   jobNoToBeEdited.amount = amount;
//   jobNoToBeEdited.POContract = POContract;
//   jobNoToBeEdited.changeOrder = changeOrder;
//   jobNoToBeEdited.percentageBilled = percentageBilled;
//   jobNoToBeEdited.notes = notes;
//   jobNoToBeEdited.generalContractor = generalContractor;
//   try {
//     await jobNoToBeEdited.save();
//   } catch (error) {
//     res.json({ message: "Enable to edit job Number", error: true });
//     return next(error);
//   }
//   res.status(201).json({ message: "Edited successfully", error: false });
// };
const deleteJobNumber = async (req, res, next) => {
  const { jobNumberId } = req.params;
  try {
    await jobNumberModel.findByIdAndRemove(jobNumberId);
  } catch (error) {
    res.json({
      message: "Could not found the specific Job Number",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addJobNumberNote = async (req, res, next) => {
  const {
    jobNumber,
    note,

    user,
  } = req.body;
  var arr = [];
  try {
    await jobNumberModel.findOneAndUpdate(
      { jobNumber: `${jobNumber}` },
      {
        $push: {
          notesMultiple: {
            dateAdded: moment(new Date()).format("MM-DD-YYYY"),
            timeAdded: moment(new Date()).format("hh:mm a"),
            addedBy: user,
            note: note,
          },
        },
      }
    );
    console.log("success");
    res.status(201).json({ message: "added successfully", error: false });
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
};
const editJobNumberNotes = async (req, res, next) => {
  const { note, user } = req.body;
  const { jobNumberId, jobNumberNoteId } = req.params;
  try {
    jobNumberNoteToBeEdited = await jobNumber.findById(jobNumberId);
  } catch (error) {
    res.json({ message: "Could not find the tool", error: true });
    return next(error);
  }
  jobNumberNoteToBeEdited.notesMultiple.forEach((i) => {
    if (i.id == jobNumberNoteId) {
      i.note = note;
      i.addedBy = user;
      i.dateAdded = moment(new Date()).format("MM-DD-YYYY");
      i.timeAdded = moment(new Date()).format("hh:mm a");
    }
  });
  try {
    await jobNumberNoteToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Job Number Notes", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteJobNumberNote = async (req, res, next) => {
  const { jobNumber, jobNumberNoteId } = req.body;
  console.log("here", jobNumber, jobNumberNoteId);
  var arr = [];
  try {
    await jobNumberModel
      .updateOne(
        { jobNumber: `${jobNumber}` },
        {
          $pull: {
            notesMultiple: { _id: jobNumberNoteId },
          },
        }
      )
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
    console.log("success");
    res.status(201).json({ message: "deleted successfully", error: false });
  } catch (error) {
    res.json({ message: "Error Occured", error: true });
  }
};
exports.addJobNumber = addJobNumber;
exports.getJobNumber = getJobNumber;
exports.editJobNumber = editJobNumber;
exports.deleteJobNumber = deleteJobNumber;
exports.getASCJobNumber = getASCJobNumber;
exports.addJobNumberNote = addJobNumberNote;
exports.deleteJobNumberNote = deleteJobNumberNote;
exports.editJobNumberNotes = editJobNumberNotes;
