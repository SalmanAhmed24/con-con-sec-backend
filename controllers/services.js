const aws = require("aws-sdk");
const serviceModel = require("../models/servicesModel");
const momentObj = require("moment");
const dotenv = require("dotenv");

dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addServices = async (req, res, next) => {
  const {
    ticketId,
    manualId,
    ticketStatus,
    to,
    dateOfOrder,
    contactName,
    email,
    tel,
    createdBy,
    assignedTo,
    customerOrderNo,
    startDate,
    jobName,
    jobLocation,
    invoiceDate,
    terms,
    description,
    laborArr,
    totalLabor,
    materialArr,
    totalMaterail,
    total,
    note,
    date,
    time,
    user,
  } = req.body;
  var arr = [];
  const files = req.files;
  console.log("files", files);
  var arr = [];
  var creatServiceModel;
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
    creatServiceModel = new serviceModel({
      ticketId,
      manualId,
      to,
      dateOfOrder,
      ticketStatus,
      contactName,
      email,
      tel,
      createdBy,
      assignedTo,
      customerOrderNo,
      startDate,
      jobName,
      jobLocation,
      invoiceDate,
      terms,
      description,
      laborArr: JSON.parse(laborArr),
      totalLabor,
      materialArr: JSON.parse(materialArr),
      totalMaterail,
      total,
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
      remaining: total,
    });
  } catch (error) {
    res.json({ message: "Could not find the user note", error: true });
    return next(error);
  }

  try {
    await creatServiceModel.save();
  } catch (error) {
    res.json({ message: "Error adding Services", error: true });
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
const getServices = async (req, res, next) => {
  let services;
  try {
    services = await serviceModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Services", error: true });
    return next(error);
  }
  res.json({
    services: services.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const getBySearch = async (req, res, next) => {
  const { filterName, search } = req.query;
  console.log("This is filter name", filterName);
  console.log("This is search", search);
  var services;
  try {
    if (filterName == "Employee") {
      services = await serviceModel.find({ assignedTo: search });
    }
    if (filterName == "Customer") {
      services = await serviceModel.find({
        to: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "ServiceNo") {
      services = await serviceModel.find({
        manualId: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "Telephone") {
      services = await serviceModel.find({
        tel: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "Email") {
      services = await serviceModel.find({
        email: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "TicketId") {
      services = await serviceModel.find({
        ticketId: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "DateOrder") {
      services = await serviceModel.find({
        dateOfOrder: { $regex: `${search}`, $options: "i" },
      });
    }
    if (filterName == "ContactName") {
      services = await serviceModel.find({
        contactName: { $regex: `${search}`, $options: "i" },
      });
    }
  } catch (error) {
    res.json({ message: "Error finding Services", error: true });
    return next(error);
  }
  res.json({
    services: services.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editServices = async (req, res, next) => {
  const {
    ticketId,
    ticketStatus,
    to,
    dateOfOrder,
    contactName,
    assignedTo,
    email,
    tel,
    createdBy,
    customerOrderNo,
    startDate,
    jobName,
    jobLocation,
    invoiceDate,
    terms,
    description,
    laborArr,
    totalLabor,
    materialArr,
    totalMaterail,
    total,
    manualId,
    remaining,
  } = req.body;
  console.log("##$$%%%%", remaining);
  const { serviceId } = req.params;
  let serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
  } catch (error) {
    res.json({ message: "Could not find the Services", error: true });
    return next(error);
  }
  if (serviceToBeEdited.payments.length < 1) {
    serviceToBeEdited.remaining = total;
  } else if (remaining == undefined) {
    serviceToBeEdited.remaining = total;
  } else {
    serviceToBeEdited.remaining = remaining;
  }
  serviceToBeEdited.ticketId = ticketId;
  serviceToBeEdited.manualId = manualId;
  serviceToBeEdited.to = to;
  serviceToBeEdited.dateOfOrder = dateOfOrder;
  serviceToBeEdited.contactName = contactName;
  serviceToBeEdited.email = email;
  serviceToBeEdited.tel = tel;
  serviceToBeEdited.createdBy = createdBy;
  serviceToBeEdited.assignedTo = assignedTo;
  serviceToBeEdited.customerOrderNo = customerOrderNo;
  serviceToBeEdited.startDate = startDate;
  serviceToBeEdited.jobName = jobName;
  serviceToBeEdited.jobLocation = jobLocation;
  serviceToBeEdited.invoiceDate = invoiceDate;
  serviceToBeEdited.terms = terms;
  serviceToBeEdited.description = description;
  serviceToBeEdited.laborArr = JSON.parse(laborArr);
  serviceToBeEdited.totalLabor = totalLabor;
  serviceToBeEdited.materialArr = JSON.parse(materialArr);
  serviceToBeEdited.totalMaterail = totalMaterail;
  serviceToBeEdited.total = total;
  serviceToBeEdited.ticketStatus = ticketStatus;
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Services", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setAssignTo = async (req, res, next) => {
  const { ticketStatus, assignedTo } = req.body;
  const { serviceId } = req.params;
  let serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
  } catch (error) {
    res.json({ message: "Could not find the Services", error: true });
    return next(error);
  }
  serviceToBeEdited.assignedTo = assignedTo;
  serviceToBeEdited.ticketStatus = ticketStatus;
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Services", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setDeleteFlag = async (req, res, next) => {
  const { serviceId } = req.params;
  let serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
  } catch (error) {
    res.json({ message: "Could not find the service ticket", error: true });
    return next(error);
  }
  serviceToBeEdited.deleteFlag = true;
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit service ticket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setRestore = async (req, res, next) => {
  console.log("restored called");
  const { serviceId } = req.params;
  let serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
  } catch (error) {
    res.json({ message: "Could not find the service ticket", error: true });
    return next(error);
  }
  serviceToBeEdited.deleteFlag = false;
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit service ticket", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const setRemaining = async (req, res, next) => {
  const { remaining } = req.body;
  const { serviceId } = req.params;
  let serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
  } catch (error) {
    res.json({ message: "Could not find the Services", error: true });
    return next(error);
  }
  serviceToBeEdited.remaining = remaining;
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Services", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteServices = async (req, res, next) => {
  const { serviceId } = req.params;
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
    await serviceModel.findByIdAndRemove(serviceId);
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
  const { serviceId } = req.params;
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
    await serviceModel.updateOne(
      { _id: serviceId },
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
  const { serviceId } = req.params;
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
      userToBeEdited = await serviceModel.findById(serviceId);
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
      userToBeEdited = await serviceModel.findById(serviceId);
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
  const { serviceId, attachmentId } = req.params;
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
    await serviceModel.updateOne(
      { _id: serviceId },
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
  const { serviceId } = req.params;
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
  let serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
  } catch (error) {
    res.json({ message: "Could not find the Services", error: true });
    return next(error);
  }
  serviceToBeEdited.signature = {
    fileUrl: arr[0].fileUrl,
    filename: arr[0].filename,
  };
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({
      message: "Enable to edit Services",
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
  const { serviceId } = req.params;
  try {
    await serviceModel.updateOne(
      { _id: serviceId },
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
  const { serviceId, paymentId } = req.params;
  var serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
    serviceToBeEdited.payments.forEach((inner) => {
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
    serviceToBeEdited.remaining = remainingAmount;
  } catch (error) {
    res.json({ message: "Could not set Remaining Amount", error: true });
    return next(error);
  }
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Could not save Remaining Amount", error: true });
    return next(error);
  }
  res.json({ message: "Edit Successfully", error: false });
};
const deletePayments = async (req, res, next) => {
  const { remainingAmount } = req.body;
  const { serviceId, paymentId } = req.params;
  var serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
    serviceToBeEdited.remaining = remainingAmount;
  } catch (error) {
    res.json({ message: "Could not set Remaining Amount", error: true });
    return next(error);
  }
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Could not save Remaining Amount", error: true });
    return next(error);
  }
  try {
    await serviceModel.updateOne(
      { _id: serviceId },
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
  const { serviceId } = req.params;
  const { oldFiles } = req.body;
  try {
    const prevFile = JSON.parse(oldFiles);
    deleteAwsObj(prevFile);
  } catch (error) {
    res.json({ message: "Error Occured in S3 upload", error: true });
  }
  let serviceToBeEdited;
  try {
    serviceToBeEdited = await serviceModel.findById(serviceId);
  } catch (error) {
    res.json({ message: "Could not find the Services", error: true });
    return next(error);
  }
  serviceToBeEdited.signature = {};
  try {
    await serviceToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Services", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
exports.addServices = addServices;
exports.getServices = getServices;
exports.editServices = editServices;
exports.deleteServices = deleteServices;
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
exports.getBySearch = getBySearch;
exports.setDeleteFlag = setDeleteFlag;
exports.setRestore = setRestore;
