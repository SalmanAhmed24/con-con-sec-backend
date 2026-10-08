const aws = require("aws-sdk");
const jobTicketModel = require("../models/jobTickets");
const momentObj = require("moment");
const dotenv = require("dotenv");

dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addJobTickets = async (req, res, next) => {
  const {
    ticketId,
    jobNumber,
    manualId,
    ticketStatus,
    dateOfOrder,
    contactName,
    email,
    tel,
    createdBy,
    assignedTo,
    assignedBy,
    startDate,
    jobLocation,
    dateArr,
    note,
    date,
    time,
    user,
  } = req.body;
  var arr = [];
  const files = req.files;
  console.log("files", files);
  var arr = [];
  var creatjobTicketModel;
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
    creatjobTicketModel = new jobTicketModel({
      ticketId,
      manualId,
      jobNumber,
      dateOfOrder,
      ticketStatus,
      contactName,
      email,
      tel,
      createdBy,
      assignedTo,
      assignedBy,
      startDate,
      jobLocation,
      dateArr: JSON.parse(dateArr),
      payments: [],
      attachments: arr.length
        ? [
            {
              note: note,
              date: date,
              time: time,
              user: user,
              files: arr,
            },
          ]
        : [],
    });
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }

  try {
    await creatjobTicketModel.save();
  } catch (error) {
    res.json({ message: "Error adding jobTicket", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
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
const getJobTickets = async (req, res, next) => {
  let jobTicket;
  try {
    jobTicket = await jobTicketModel.find({});
  } catch (error) {
    res.json({ message: "Error finding jobTicket", error: true });
    return next(error);
  }
  res.json({
    jobTicket: jobTicket.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editJobTickets = async (req, res, next) => {
  const {
    ticketId,
    jobNumber,
    manualId,
    ticketStatus,
    dateOfOrder,
    contactName,
    email,
    tel,
    createdBy,
    assignedTo,
    assignedBy,
    startDate,
    jobLocation,
    // laborArr,
    // materialArr,
    dateArr,
    note,
    date,
    time,
    user,
  } = req.body;
  const { jobTicketId } = req.params;
  let jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
  } catch (error) {
    res.json({ message: "Could not find the jobTicket", error: true });
    return next(error);
  }
  jobTicketToBeEdited.ticketId = ticketId;
  jobTicketToBeEdited.manualId = manualId;
  jobTicketToBeEdited.jobNumber = jobNumber;
  jobTicketToBeEdited.dateOfOrder = dateOfOrder;
  jobTicketToBeEdited.contactName = contactName;
  jobTicketToBeEdited.email = email;
  jobTicketToBeEdited.tel = tel;
  jobTicketToBeEdited.createdBy = createdBy;
  jobTicketToBeEdited.assignedTo = assignedTo;
  jobTicketToBeEdited.assignedBy = assignedBy;
  jobTicketToBeEdited.startDate = startDate;
  jobTicketToBeEdited.jobLocation = jobLocation;
  jobTicketToBeEdited.dateArr = JSON.parse(dateArr);
  jobTicketToBeEdited.ticketStatus = ticketStatus;
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit jobTicket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setAssignTo = async (req, res, next) => {
  const { ticketStatus, assignedTo } = req.body;
  const { jobTicketId } = req.params;
  let jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
  } catch (error) {
    res.json({ message: "Could not find the jobTicket", error: true });
    return next(error);
  }
  jobTicketToBeEdited.assignedTo = assignedTo;
  jobTicketToBeEdited.ticketStatus = ticketStatus;
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit jobTicket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setDeleteFlag = async (req, res, next) => {
  const { jobTicketId } = req.params;
  let jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
  } catch (error) {
    res.json({ message: "Could not find the jobTicket", error: true });
    return next(error);
  }
  jobTicketToBeEdited.deleteFlag = true;
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit jobTicket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setRestore = async (req, res, next) => {
  console.log("restored called");
  const { jobTicketId } = req.params;
  let jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
  } catch (error) {
    res.json({ message: "Could not find the jobTicket", error: true });
    return next(error);
  }
  jobTicketToBeEdited.deleteFlag = false;
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit jobTicket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setRemaining = async (req, res, next) => {
  const { remaining } = req.body;
  const { jobTicketId } = req.params;
  let jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
  } catch (error) {
    res.json({ message: "Could not find the jobTicket", error: true });
    return next(error);
  }
  jobTicketToBeEdited.remaining = remaining;
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit jobTicket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteJobTickets = async (req, res, next) => {
  const { jobTicketId } = req.params;
  // const { oldFiles } = req.body;
  // console.log("###", req.body);
  // console.log("oldFiles", oldFiles);
  // var allFiles = JSON.parse(oldFiles);
  // try {
  //   allFiles.forEach((item) => {
  //     deleteAwsObj(item);
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.json({ message: "Could not delete the files", error: true });
  //   return next(error);
  // }
  try {
    await jobTicketModel.findByIdAndRemove(jobTicketId);
  } catch (error) {
    res.json({
      message: "Could not found the specific Service",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addFiles = async (req, res, next) => {
  const { date, time, user, note } = req.body;
  const { jobTicketId } = req.params;
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
    await jobTicketModel.updateOne(
      { _id: jobTicketId },
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
const editFiles = async (req, res, next) => {
  const { jobTicketId } = req.params;
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
      userToBeEdited = await jobTicketModel.findById(jobTicketId);
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
      userToBeEdited = await jobTicketModel.findById(jobTicketId);
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
const delFiles = async (req, res, next) => {
  const { jobTicketId, attachmentId } = req.params;
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
    await jobTicketModel.updateOne(
      { _id: jobTicketId },
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
const addSignature = async (req, res, next) => {
  const { jobTicketId } = req.params;
  var arr = [];
  try {
    await uploadToS3(req.files[0])
      .then((res) => {
        arrReturn(res, arr);
      })
      .catch((err) => console.log(err));
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
  let jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
  } catch (error) {
    res.json({ message: "Could not find the jobTicket", error: true });
    return next(error);
  }
  jobTicketToBeEdited.signature = {
    fileUrl: arr[0].fileUrl,
    filename: arr[0].filename,
  };
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({
      message: "Enable to edit jobTicket",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({
    message: "Edited successfully",
    data: { fileUrl: arr[0].fileUrl, filename: arr[0].filename },
    error: false,
  });
};
const addPayments = async (req, res, next) => {
  const { date, checkNo, payment, amount, remainingAmount, paymentType, note } =
    req.body;
  const { jobTicketId } = req.params;
  try {
    await jobTicketModel.updateOne(
      { _id: jobTicketId },
      {
        $push: {
          payments: {
            date: date,
            checkNo: checkNo,
            payment: payment,
            amount: amount,
            remainingAmount: remainingAmount,
            paymentType: paymentType,
            note: note,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the Service Ticket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};
const editPayments = async (req, res, next) => {
  const { date, checkNo, payment, amount, remainingAmount, paymentType, note } =
    req.body;
  const { jobTicketId, paymentId } = req.params;
  var jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
    jobTicketToBeEdited.payments.forEach((inner) => {
      if (inner.id == paymentId) {
        inner.date = date;
        inner.checkNo = checkNo;
        inner.payment = payment;
        inner.amount = amount;
        inner.paymentType = paymentType;
        inner.note = note;
        inner.remainingAmount = remainingAmount;
      }
    });
    jobTicketToBeEdited.remaining = remainingAmount;
  } catch (error) {
    res.json({ message: "Could not set Remaining Amount", error: true });
    return next(error);
  }
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Could not save Remaining Amount", error: true });
    return next(error);
  }
  res.json({ message: "Edit Successfully", error: false });
};
const deletePayments = async (req, res, next) => {
  const { remainingAmount } = req.body;
  const { jobTicketId, paymentId } = req.params;
  var jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
    jobTicketToBeEdited.remaining = remainingAmount;
  } catch (error) {
    res.json({ message: "Could not set Remaining Amount", error: true });
    return next(error);
  }
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Could not save Remaining Amount", error: true });
    return next(error);
  }
  try {
    await jobTicketModel.updateOne(
      { _id: jobTicketId },
      {
        $pull: {
          payments: { _id: paymentId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the Payment", error: true });
    return next(error);
  }
  res.status(201).json({ message: "deleted successfully", error: false });
};
const deleteSignature = async (req, res, next) => {
  const { jobTicketId } = req.params;
  const { oldFiles } = req.body;
  try {
    const prevFile = JSON.parse(oldFiles);
    deleteAwsObj(prevFile);
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
  let jobTicketToBeEdited;
  try {
    jobTicketToBeEdited = await jobTicketModel.findById(jobTicketId);
  } catch (error) {
    res.json({ message: "Could not find the jobTicket", error: true });
    return next(error);
  }
  jobTicketToBeEdited.signature = {};
  try {
    await jobTicketToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit jobTicket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const getBySearch = async (req, res, next) => {
  const { filterName, search } = req.query;
  console.log("This is filter name", filterName);
  console.log("This is search", search);
  var jobTicket;
  try {
    if (filterName == "Employee") {
      jobTicket = await jobTicketModel.find({ assignedTo: search });
    }
    if (filterName == "jobNumber") {
      jobTicket = await jobTicketModel.find({
        jobNumber: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "TicketId") {
      jobTicket = await jobTicketModel.find({
        ticketId: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "DateOrder") {
      jobTicket = await jobTicketModel.find({
        dateOfOrder: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "ContactName") {
      jobTicket = await jobTicketModel.find({
        contactName: { $regex: `${search}`, $options: "i" },
      });
    }
  } catch (error) {
    res.json({ message: "Error finding jobTicket", error: true });
    return next(error);
  }
  res.json({
    jobTicket: jobTicket.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
exports.addJobTickets = addJobTickets;
exports.getJobTickets = getJobTickets;
exports.editJobTickets = editJobTickets;
exports.deleteJobTickets = deleteJobTickets;
exports.addFiles = addFiles;
exports.addPayments = addPayments;
exports.editPayments = editPayments;
exports.deletePayments = deletePayments;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
exports.addSignature = addSignature;
exports.deleteSignature = deleteSignature;
exports.setRemaining = setRemaining;
exports.setAssignTo = setAssignTo;
exports.setDeleteFlag = setDeleteFlag;
exports.setRestore = setRestore;
exports.getBySearch = getBySearch;
