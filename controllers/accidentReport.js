const accidentReportModel = require("../models/accidentReport");
const addAccidentReport = async (req, res, next) => {
  const {
    employee,
    jobTitle,
    date,
    time,
    supervisor,
    witness,
    briefDescription,
    bodyPartsAffected,
    doctor,
    compensationForm,
    leftShift,
    leftDate,
    leftTime,
    supervisorComments,
    preventAccident,
    unsafeConditions,
    unsafeConditionsComments,
    mainDate,
    phone,
    additionalComments,
    supervisorSignature,
  } = req.body;
  const createAccidentReportModel = new accidentReportModel({
    employee,
    jobTitle,
    date,
    time,
    supervisor,
    witness,
    briefDescription,
    bodyPartsAffected,
    doctor,
    compensationForm,
    leftShift,
    leftDate,
    leftTime,
    supervisorComments,
    preventAccident,
    unsafeConditions,
    unsafeConditionsComments,
    mainDate,
    phone,
    additionalComments,
    supervisorSignature,
  });
  try {
    await createAccidentReportModel.save();
  } catch (error) {
    res.json({ message: "Error adding accident Report", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getAccidentReport = async (req, res, next) => {
  let accidentReports;
  try {
    accidentReports = await accidentReportModel.find({});
  } catch (error) {
    res.json({ message: "Error finding accident Report list", error: true });
    return next(error);
  }
  res.json({
    accidentReports: accidentReports.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editAccidentReport = async (req, res, next) => {
  const {
    employee,
    jobTitle,
    date,
    time,
    supervisor,
    witness,
    briefDescription,
    bodyPartsAffected,
    doctor,
    compensationForm,
    leftShift,
    leftDate,
    leftTime,
    supervisorComments,
    preventAccident,
    unsafeConditions,
    unsafeConditionsComments,
    mainDate,
    phone,
    additionalComments,
    supervisorSignature,
  } = req.body;
  const { accidentReportId } = req.params;
  let inspectionToBeEdited;
  try {
    inspectionToBeEdited = await accidentReportModel.findById(accidentReportId);
  } catch (error) {
    res.json({ message: "Could not find the accident Report", error: true });
    return next(error);
  }
  inspectionToBeEdited.employee = employee;
  inspectionToBeEdited.jobTitle = jobTitle;
  inspectionToBeEdited.date = date;
  inspectionToBeEdited.time = time;
  inspectionToBeEdited.supervisor = supervisor;
  inspectionToBeEdited.witness = witness;
  inspectionToBeEdited.briefDescription = briefDescription;
  inspectionToBeEdited.bodyPartsAffected = bodyPartsAffected;
  inspectionToBeEdited.doctor = doctor;
  inspectionToBeEdited.compensationForm = compensationForm;
  inspectionToBeEdited.leftShift = leftShift;
  inspectionToBeEdited.leftDate = leftDate;
  inspectionToBeEdited.leftTime = leftTime;
  inspectionToBeEdited.supervisorComments = supervisorComments;
  inspectionToBeEdited.preventAccident = preventAccident;
  inspectionToBeEdited.unsafeConditions = unsafeConditions;
  inspectionToBeEdited.unsafeConditionsComments = unsafeConditionsComments;
  inspectionToBeEdited.mainDate = mainDate;
  inspectionToBeEdited.phone = phone;
  inspectionToBeEdited.additionalComments = additionalComments;
  inspectionToBeEdited.supervisorSignature = supervisorSignature;
  try {
    await inspectionToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit accident Report", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteAccidentReport = async (req, res, next) => {
  const { accidentReportId } = req.params;
  try {
    await accidentReportModel.findByIdAndRemove(accidentReportId);
  } catch (error) {
    res.json({
      message: "Could not found the specific vehicle",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addAccidentReport = addAccidentReport;
exports.getAccidentReport = getAccidentReport;
exports.editAccidentReport = editAccidentReport;
exports.deleteAccidentReport = deleteAccidentReport;
