const serviceNumberModel = require("../models/serviceNumbers");
const addServiceNumber = async (req, res, next) => {
  const {
    serviceNumber,
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
  } = req.body;
  const createServiceNumber = new serviceNumberModel({
    serviceNumber,
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
  });
  try {
    await createServiceNumber.save();
  } catch (error) {
    res.json({ message: "Error adding service Number", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
// const addServiceNumber = async (req, res, next) => {
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
//   const createServiceNumber = new serviceNumberModel({
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
//     await createServiceNumber.save();
//   } catch (error) {
//     res.json({ message: "Error adding Job Number", error: true });
//     return next(error);
//   }
//   res.json({ message: "Created Successfully", error: false });
// };
const getServiceNumber = async (req, res, next) => {
  const { jobTag, jobPM, client } = req.query;
  if (jobTag !== undefined || jobPM !== undefined) {
    let serviceNumbers;
    try {
      serviceNumbers = await serviceNumberModel.find({
        jobTag: {
          $regex: jobTag !== undefined ? jobTag : "",
          $options: "i",
        },
        jobPM: {
          $regex: jobPM !== undefined ? jobPM : "",
          $options: "i",
        },
        client: {
          $regex: client !== undefined ? client : "",
          $options: "i",
        },
      });
    } catch (error) {
      res.json({ message: "Error finding Tasks list", error: true });
      return next(error);
    }
    res.json({
      serviceNumbers: serviceNumbers.map((item) =>
        item.toObject({ getters: true })
      ),
      error: false,
    });
  } else {
    let serviceNumbers;
    try {
      serviceNumbers = await serviceNumberModel.find({});
    } catch (error) {
      res.json({ message: "Error finding service Number list", error: true });
      return next(error);
    }
    res.json({
      serviceNumbers: serviceNumbers.map((item) =>
        item.toObject({ getters: true })
      ),
      error: false,
    });
  }
};
const editServiceNumber = async (req, res, next) => {
  const {
    serviceNumber,
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
  } = req.body;
  const { serviceNumberId } = req.params;
  let serviceNoToBeEdited;
  try {
    serviceNoToBeEdited = await serviceNumberModel.findById(serviceNumberId);
  } catch (error) {
    res.json({ message: "Could not find job Number", error: true });
    return next(error);
  }
  serviceNoToBeEdited.serviceNumber = serviceNumber;
  serviceNoToBeEdited.jobName = jobName;
  serviceNoToBeEdited.initials = initials;
  serviceNoToBeEdited.generalContractor = generalContractor;
  serviceNoToBeEdited.contractTM = contractTM;
  serviceNoToBeEdited.amount = amount;
  serviceNoToBeEdited.PO = PO;
  serviceNoToBeEdited.CO = CO;
  serviceNoToBeEdited.percentageBilled = percentageBilled;
  serviceNoToBeEdited.notes = notes;
  serviceNoToBeEdited.projectChecklist = projectChecklist;
  serviceNoToBeEdited.dateCreated = dateCreated;
  serviceNoToBeEdited.dateBilled = dateBilled;
  serviceNoToBeEdited.jobPM = jobPM;
  try {
    await serviceNoToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit service Number", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
// const editServiceNumber = async (req, res, next) => {
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
//     jobNoToBeEdited = await serviceNumberModel.findById(jobNumberId);
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
const deleteServiceNumber = async (req, res, next) => {
  const { serviceNumberId } = req.params;
  try {
    await serviceNumberModel.findByIdAndRemove(serviceNumberId);
  } catch (error) {
    res.json({
      message: "Could not found the specific service Number",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addServiceNumber = addServiceNumber;
exports.getServiceNumber = getServiceNumber;
exports.editServiceNumber = editServiceNumber;
exports.deleteServiceNumber = deleteServiceNumber;
