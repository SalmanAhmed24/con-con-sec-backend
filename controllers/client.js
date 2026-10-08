const clientsModel = require("../models/client");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { uploadFile, getFile } = require("../s3");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
// const { options } = require("../routes/users");
dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});
const addClient = async (req, res, next) => {
  const {
    customerCode,
    customerName,
    alphaCode,
    address,
    city,
    state,
    zipCode,
    phone,
    fax,
    primaryContact,
    customerType,
    balance,
    taxable,
    status,
    customerTerm,
    taxCode,
    retailCertificate,
    resaleExpDate,
    salesPersonCode,
    receiveStatements,
    financeCharge,
    retention,
    lastDateBilled,
    lastDatePaid,
    dateEstablished,
    creditLimit,
    materialLevel,
    laborLevel,
    primaryEmail,
    secondaryEmail,
  } = req.body;
  const createClientModel = new clientsModel({
    customerCode,
    customerName,
    alphaCode,
    address,
    city,
    state,
    zipCode,
    phone,
    fax,
    primaryContact,
    customerType,
    balance,
    taxable,
    status,
    customerTerm,
    taxCode,
    retailCertificate,
    resaleExpDate,
    salesPersonCode,
    receiveStatements,
    financeCharge,
    retention,
    lastDateBilled,
    lastDatePaid,
    dateEstablished,
    creditLimit,
    materialLevel,
    laborLevel,
    primaryEmail,
    secondaryEmail,
  });
  try {
    await createClientModel.save();
  } catch (error) {
    res.json({ message: "Error adding Cliebt", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getClient = async (req, res, next) => {
  const { page, pageSize } = req.query;
  console.log("page and pageSize", page, pageSize);
  let clients;
  let totalCount;
  if (page && pageSize) {
    try {
      clients = await clientsModel
        .find({})
        .limit(parseInt(pageSize))
        .skip((page - 1) * pageSize);
      totalCount = await clientsModel.find({}).count();
    } catch (error) {
      res.json({ message: "Error finding Device list", error: true });
      return next(error);
    }
    res.json({
      clients: clients.map((item) => item.toObject({ getters: true })),
      totalCount: totalCount,
      error: false,
    });
  } else {
    try {
      clients = await clientsModel.find({});
    } catch (error) {
      res.json({ message: "Error finding Device list", error: true });
      return next(error);
    }
    res.json({
      clients: clients.map((item) => {
        return { customerName: item.customerName };
      }),
      error: false,
    });
  }
};
const editClient = async (req, res, next) => {
  const {
    customerCode,
    customerName,
    alphaCode,
    address,
    city,
    state,
    zipCode,
    phone,
    fax,
    primaryContact,
    customerType,
    balance,
    taxable,
    status,
    customerTerm,
    taxCode,
    retailCertificate,
    resaleExpDate,
    salesPersonCode,
    receiveStatements,
    financeCharge,
    retention,
    lastDateBilled,
    lastDatePaid,
    primaryEmail,
    secondaryEmail,
    dateEstablished,
    creditLimit,
    materialLevel,
    laborLevel,
  } = req.body;
  const { clientId } = req.params;
  let clientToBeEdited;
  try {
    clientToBeEdited = await clientsModel.findById(clientId);
  } catch (error) {
    res.json({ message: "Could not find the client", error: true });
    return next(error);
  }
  clientToBeEdited.customerCode = customerCode;
  clientToBeEdited.customerName = customerName;
  clientToBeEdited.alphaCode = alphaCode;
  clientToBeEdited.address = address;
  clientToBeEdited.city = city;
  clientToBeEdited.state = state;
  clientToBeEdited.zipCode = zipCode;
  clientToBeEdited.phone = phone;
  clientToBeEdited.fax = fax;
  clientToBeEdited.primaryContact = primaryContact;
  clientToBeEdited.customerType = customerType;
  clientToBeEdited.balance = balance;
  clientToBeEdited.taxable = taxable;
  clientToBeEdited.status = status;
  clientToBeEdited.customerTerm = customerTerm;
  clientToBeEdited.taxCode = taxCode;
  clientToBeEdited.retailCertificate = retailCertificate;
  clientToBeEdited.resaleExpDate = resaleExpDate;
  clientToBeEdited.salesPersonCode = salesPersonCode;
  clientToBeEdited.receiveStatements = receiveStatements;
  clientToBeEdited.financeCharge = financeCharge;
  clientToBeEdited.retention = retention;
  clientToBeEdited.lastDateBilled = lastDateBilled;
  clientToBeEdited.lastDatePaid = lastDatePaid;
  clientToBeEdited.primaryEmail = primaryEmail;
  clientToBeEdited.secondaryEmail = secondaryEmail;
  clientToBeEdited.dateEstablished = dateEstablished;
  clientToBeEdited.creditLimit = creditLimit;
  clientToBeEdited.materialLevel = materialLevel;
  clientToBeEdited.laborLevel = laborLevel;
  try {
    await clientToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit client", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteClient = async (req, res, next) => {
  const { clientId } = req.params;
  try {
    await clientsModel.findByIdAndRemove(clientId);
  } catch (error) {
    res.json({ message: "Could not found the specific client", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const getCustomerByName = async (req, res, next) => {
  const { name } = req.params;
  let allClients;
  try {
    allClients = await clientsModel.find({
      customerName: { $regex: name, $options: "i" },
    });
  } catch (error) {
    res.json({ message: "Error finding users list", error: true });
    return next(error);
  }
  res.json({
    clients: allClients.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const addInvoices = async (req, res, next) => {
  const {
    invoiceDate,
    jobId,
    invoice,
    originalAmount,
    totalAmount,
    retentionAmount,
    retentionStartDate,
    nonRetentionAmount,
    zeroDaysAmount,
    thirtyDaysAmount,
    sixtyDaysAmount,
    ninetyDaysAmount,
    auditDate,
    lastStatementDate,
    notes,
    paid,
    remainingAmount,
  } = req.body;
  const files = req.files;
  console.log(files);
  const { clientId } = req.params;
  var arr = [];
  if (files && files.length) {
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
      await clientsModel.updateOne(
        { _id: clientId },
        {
          $push: {
            invoices: {
              invoiceDate,
              jobId,
              invoice,
              originalAmount,
              totalAmount,
              retentionAmount,
              retentionStartDate,
              nonRetentionAmount,
              zeroDaysAmount,
              thirtyDaysAmount,
              sixtyDaysAmount,
              ninetyDaysAmount,
              auditDate,
              lastStatementDate,
              notes,
              paid,
              remainingAmount: totalAmount,
              payments: [],
              attachments: { files: arr },
            },
          },
        }
      );
    } catch (error) {
      res.json({ message: "Could not find the Client", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    try {
      await clientsModel.updateOne(
        { _id: clientId },
        {
          $push: {
            invoices: {
              invoiceDate,
              jobId,
              invoice,
              originalAmount,
              totalAmount,
              retentionAmount,
              retentionStartDate,
              nonRetentionAmount,
              zeroDaysAmount,
              thirtyDaysAmount,
              sixtyDaysAmount,
              ninetyDaysAmount,
              auditDate,
              lastStatementDate,
              notes,
              paid,
              remainingAmount: totalAmount,
              payments: [],
              attachments: [],
            },
          },
        }
      );
    } catch (error) {
      res.json({ message: "Could not find the Client", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  }
};
const editInvoices = async (req, res, next) => {
  const {
    invoiceDate,
    jobId,
    invoice,
    originalAmount,
    totalAmount,
    retentionAmount,
    retentionStartDate,
    nonRetentionAmount,
    zeroDaysAmount,
    thirtyDaysAmount,
    sixtyDaysAmount,
    ninetyDaysAmount,
    auditDate,
    lastStatementDate,
    notes,
    paid,
    newFileFlag,
    oldFiles,
  } = req.body;
  const files = req.files;
  const { clientId, invoiceId } = req.params;
  let clientToBeEdited;
  if (newFileFlag === "true") {
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
      clientToBeEdited = await clientsModel.findById(clientId);
      clientToBeEdited.invoices.forEach((i) => {
        if (i.id == invoiceId) {
          i.jobId = jobId;
          i.invoice = invoice;
          i.originalAmount = originalAmount;
          i.totalAmount = totalAmount;
          i.retentionAmount = retentionAmount;
          i.retentionStartDate = retentionStartDate;
          i.nonRetentionAmount = nonRetentionAmount;
          i.zeroDaysAmount = zeroDaysAmount;
          i.thirtyDaysAmount = thirtyDaysAmount;
          i.sixtyDaysAmount = sixtyDaysAmount;
          i.ninetyDaysAmount = ninetyDaysAmount;
          i.auditDate = auditDate;
          i.lastStatementDate = lastStatementDate;
          i.notes = notes;
          i.paid = paid;
          i.invoiceDate = invoiceDate;
          i.attachments = { files: arr };
        }
      });
    } catch (error) {
      res.json({ message: "Could not find the Client", error: true });
      return next(error);
    }
    try {
      await clientToBeEdited.save();
      res.status(201).json({ message: "Edited successfully", error: false });
    } catch (error) {
      res.json({ message: "Enable to edit Invoices", error: true });
      return next(error);
    }
  } else {
    const prevFileArr = JSON.parse(oldFiles);
    try {
      clientToBeEdited = await clientsModel.findById(clientId);
      clientToBeEdited.invoices.forEach((i) => {
        if (i.id == invoiceId) {
          i.jobId = jobId;
          i.invoice = invoice;
          i.originalAmount = originalAmount;
          i.totalAmount = totalAmount;
          i.retentionAmount = retentionAmount;
          i.retentionStartDate = retentionStartDate;
          i.nonRetentionAmount = nonRetentionAmount;
          i.zeroDaysAmount = zeroDaysAmount;
          i.thirtyDaysAmount = thirtyDaysAmount;
          i.sixtyDaysAmount = sixtyDaysAmount;
          i.ninetyDaysAmount = ninetyDaysAmount;
          i.auditDate = auditDate;
          i.lastStatementDate = lastStatementDate;
          i.notes = notes;
          i.paid = paid;
          i.invoiceDate = invoiceDate;
          i.attachments = { files: prevFileArr };
        }
      });
    } catch (error) {
      res.json({ message: "Could not find the Client", error: true });
      return next(error);
    }
    try {
      await clientToBeEdited.save();
      res.status(201).json({ message: "Edited successfully", error: false });
    } catch (error) {
      res.json({ message: "Enable to edit Invoices", error: true });
      return next(error);
    }
  }
};
const invoiceStatus = async (req, res, next) => {
  const { paid } = req.body;
  const { clientId, invoiceId } = req.params;
  try {
    clientToBeEdited = await clientsModel.findById(clientId);
    clientToBeEdited.invoices.forEach((i) => {
      if (i.id == invoiceId) {
        i.paid = paid;
      }
    });
  } catch (error) {
    res.json({ message: "Could not find the Client", error: true });
    return next(error);
  }
  try {
    await clientToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Invoices", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const addPayments = async (req, res, next) => {
  const {
    id,
    date,
    checkNo,
    payment,
    amount,
    remainingAmount,
    paymentType,
    note,
  } = req.body;
  const { clientId, invoiceId } = req.params;
  try {
    clientToBeEdited = await clientsModel.findById(clientId);
    clientToBeEdited.invoices.forEach((i) => {
      if (i.id == invoiceId) {
        i.remainingAmount = remainingAmount;
        if (i.payments == undefined) {
          i.payments = [
            {
              date: date,
              checkNo: checkNo,
              payment: payment,
              amount: amount,
              remainingAmount: remainingAmount,
              paymentType: paymentType,
              note: note,
            },
          ];
        } else {
          i.payments = [
            {
              date: date,
              checkNo: checkNo,
              payment: payment,
              amount: amount,
              remainingAmount: remainingAmount,
              paymentType: paymentType,
              note: note,
            },
            ...i.payments,
          ];
        }
      }
    });
  } catch (error) {
    res.json({ message: "Could not find the Client", error: true });
    return next(error);
  }
  try {
    await clientToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to add Payments", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};
const deleteInvoices = async (req, res, next) => {
  const { clientId, invoiceId } = req.params;
  try {
    await clientsModel.updateOne(
      { _id: clientId },
      {
        $pull: {
          invoices: { _id: invoiceId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the client", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addFiles = async (req, res, next) => {
  const { date, user, note, attachmentCategories } = req.body;
  const { clientId } = req.params;
  const files = req.files;
  var arr = [];
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
    await clientsModel.updateOne(
      { _id: clientId },
      {
        $push: {
          attachments: {
            date: date,
            user: user,
            note: note,
            attachmentCategories: attachmentCategories,
            files: arr,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};
const arrReturn = (item, arr) => {
  arr.push(item);
};
const editFiles = async (req, res, next) => {
  const { clientId } = req.params;
  const {
    date,
    user,
    id,
    newFileFlag,
    editFlag,
    oldFiles,
    note,
    attachmentCategories,
  } = req.body;
  const files = req.files;
  let clientToBeEdited;
  if (newFileFlag === "true") {
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
      clientToBeEdited = await clientsModel.findById(clientId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    clientToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.date = date;
        i.user = user;
        i.note = note;
        i.attachmentCategories = attachmentCategories;
        i.files = arr;
      }
    });
    try {
      await clientToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit task", error: true });
      return next(error);
    }
    res.status(201).json({ message: "Edited successfully", error: false });
  } else {
    const prevFileArr = JSON.parse(oldFiles);
    try {
      clientToBeEdited = await clientsModel.findById(clientId);
    } catch (error) {
      res.json({ message: "Could not find the attachments", error: true });
      return next(error);
    }
    clientToBeEdited.attachments.forEach((i) => {
      if (i._id.toString() == id) {
        i.date = date;
        i.user = user;
        i.note = note;
        i.attachmentCategories = attachmentCategories;
        i.files = prevFileArr;
      }
    });
    try {
      await clientToBeEdited.save();
    } catch (error) {
      res.json({ message: "Enable to edit task", error: true });
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
  const { clientId, attachmentId } = req.params;
  const { oldFiles } = req.body;
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
    await clientsModel.updateOne(
      { _id: clientId },
      {
        $pull: {
          attachments: { _id: attachmentId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
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
const editPayments = async (req, res, next) => {
  const {
    id,
    date,
    checkNo,
    payment,
    amount,
    remainingAmount,
    paymentType,
    note,
  } = req.body;
  const { clientId, invoiceId, paymentId } = req.params;
  console.log("this is req body", req.body);
  console.log("this is req paramsm", req.params);
  try {
    clientToBeEdited = await clientsModel.findById(clientId);
    clientToBeEdited.invoices.forEach((i) => {
      if (i.id == invoiceId) {
        i.remainingAmount = remainingAmount;
        const allPayments = i.payments.map((inner) => {
          if (inner._id == paymentId) {
            return {
              date: date,
              checkNo: checkNo,
              payment: payment,
              amount: amount,
              paymentType: paymentType,
              note: note,
              remainingAmount: remainingAmount,
              _id: inner._id,
            };
          } else {
            return inner;
          }
        });
        i.payments = allPayments;
      }
    });
  } catch (error) {
    res.json({ message: "Could not find the Client", error: true });
    return next(error);
  }
  try {
    await clientToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to add Payments", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};
const deletePayments = async (req, res, next) => {
  const { remainingAmount } = req.body;
  const { clientId, invoiceId, paymentId } = req.params;

  try {
    clientToBeEdited = await clientsModel.findById(clientId);
    clientToBeEdited.invoices.forEach((i) => {
      if (i.id == invoiceId) {
        if (remainingAmount > i.totalAmount) {
          i.remainingAmount = i.totalAmount;
        } else {
          i.remainingAmount = remainingAmount;
        }
        const allPaymentsSimple = i.payments.map((item) =>
          item.toObject({ getters: true })
        );
        const allPayments = allPaymentsSimple.filter(
          (inner) => inner.id !== paymentId
        );
        i.payments = allPayments;
      }
    });
  } catch (error) {
    res.json({ message: "Could not find the Client", error: true });
    return next(error);
  }
  try {
    await clientToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to add Payments", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};

const getInvoices = async (req, res, next) => {
  const { clientId } = req.params;
  let clients;
  console.log("@@@@@@", clientId);
  try {
    clients = await clientsModel.findById(clientId);
    console.log("client", clients);
  } catch (error) {
    res.json({ message: "Error finding Device list", error: true });
    return next(error);
  }
  res.json({
    invoices: clients.invoices,
    error: false,
  });
};
const getAttachments = async (req, res, next) => {
  const { clientId } = req.params;
  let clients;
  console.log("@@@@@@", clientId);
  try {
    clients = await clientsModel.findById(clientId);
    console.log("client", clients);
  } catch (error) {
    res.json({ message: "Error finding Device list", error: true });
    return next(error);
  }
  res.json({
    attachments: clients.attachments,
    error: false,
  });
};

exports.addClient = addClient;
exports.getClient = getClient;
exports.editClient = editClient;
exports.deleteClient = deleteClient;
exports.getCustomerByName = getCustomerByName;
exports.addInvoices = addInvoices;
exports.addPayments = addPayments;
exports.editPayments = editPayments;
exports.deletePayments = deletePayments;
exports.invoiceStatus = invoiceStatus;
exports.editInvoices = editInvoices;
exports.deleteInvoices = deleteInvoices;
exports.addFiles = addFiles;
exports.editFiles = editFiles;
exports.delFiles = delFiles;
exports.getInvoices = getInvoices;
exports.getAttachments = getAttachments;
