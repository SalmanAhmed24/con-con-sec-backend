const vehicleInspectionModel = require("../models/vehicleInspection");
const addVehicleInspection = async (req, res, next) => {
  const {
    date,
    employee,
    vehicle,
    mileage,
    headLights,
    tailLights,
    turnSignals,
    brakeLights,
    reflectors,
    tiresRims,
    battery,
    radiator,
    exhaustSystem,
    suspension,
    fuelSystem,
    leaks,
    waterLevel,
    tranmission,
    gauges,
    horn,
    windShield,
    windshieldWipers,
    speedometer,
    steering,
    brakeSystem,
    seatBelts,
    seats,
    heater,
    mirrors,
    safetyEquipment,
    accidentKit,
    other,
    damage,
    remarks,
    signedBy,
  } = req.body;
  const createVehicleInspectionModel = new vehicleInspectionModel({
    date,
    employee,
    vehicle,
    mileage,
    headLights,
    tailLights,
    turnSignals,
    brakeLights,
    reflectors,
    tiresRims,
    battery,
    radiator,
    exhaustSystem,
    suspension,
    fuelSystem,
    leaks,
    waterLevel,
    tranmission,
    gauges,
    horn,
    windShield,
    windshieldWipers,
    speedometer,
    steering,
    brakeSystem,
    seatBelts,
    seats,
    heater,
    mirrors,
    safetyEquipment,
    accidentKit,
    other,
    damage,
    remarks,
    signedBy,
  });
  try {
    await createVehicleInspectionModel.save();
  } catch (error) {
    res.json({ message: "Error adding Vehicle Inspection", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getVehicleInspection = async (req, res, next) => {
  let vehicleInspections;
  try {
    vehicleInspections = await vehicleInspectionModel
      .find({})
      .sort([["date", -1]]);
  } catch (error) {
    res.json({ message: "Error finding vehicle inspection list", error: true });
    return next(error);
  }
  res.json({
    vehicleInspections: vehicleInspections.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editVehicleInspection = async (req, res, next) => {
  const {
    date,
    employee,
    vehicle,
    mileage,
    headLights,
    tailLights,
    turnSignals,
    brakeLights,
    reflectors,
    tiresRims,
    battery,
    radiator,
    exhaustSystem,
    suspension,
    fuelSystem,
    leaks,
    waterLevel,
    tranmission,
    gauges,
    horn,
    windShield,
    windshieldWipers,
    speedometer,
    steering,
    brakeSystem,
    seatBelts,
    seats,
    heater,
    mirrors,
    safetyEquipment,
    accidentKit,
    other,
    damage,
    remarks,
    signedBy,
  } = req.body;
  const { vehicleInspectionId } = req.params;
  let inspectionToBeEdited;
  try {
    inspectionToBeEdited = await vehicleInspectionModel.findById(
      vehicleInspectionId
    );
  } catch (error) {
    res.json({ message: "Could not find the vehicle inspection", error: true });
    return next(error);
  }
  inspectionToBeEdited.date = date;
  inspectionToBeEdited.employee = employee;
  inspectionToBeEdited.vehicle = vehicle;
  inspectionToBeEdited.mileage = mileage;
  inspectionToBeEdited.headLights = headLights;
  inspectionToBeEdited.tailLights = tailLights;
  inspectionToBeEdited.turnSignals = turnSignals;
  inspectionToBeEdited.brakeLights = brakeLights;
  inspectionToBeEdited.reflectors = reflectors;
  inspectionToBeEdited.tiresRims = tiresRims;
  inspectionToBeEdited.battery = battery;
  inspectionToBeEdited.radiator = radiator;
  inspectionToBeEdited.exhaustSystem = exhaustSystem;
  inspectionToBeEdited.suspension = suspension;
  inspectionToBeEdited.fuelSystem = fuelSystem;
  inspectionToBeEdited.leaks = leaks;
  inspectionToBeEdited.waterLevel = waterLevel;
  inspectionToBeEdited.tranmission = tranmission;
  inspectionToBeEdited.gauges = gauges;
  inspectionToBeEdited.horn = horn;
  inspectionToBeEdited.windShield = windShield;
  inspectionToBeEdited.windshieldWipers = windshieldWipers;
  inspectionToBeEdited.speedometer = speedometer;
  inspectionToBeEdited.steering = steering;
  inspectionToBeEdited.brakeSystem = brakeSystem;
  inspectionToBeEdited.seatBelts = seatBelts;
  inspectionToBeEdited.seats = seats;
  inspectionToBeEdited.heater = heater;
  inspectionToBeEdited.mirrors = mirrors;
  inspectionToBeEdited.safetyEquipment = safetyEquipment;
  inspectionToBeEdited.accidentKit = accidentKit;
  inspectionToBeEdited.other = other;
  inspectionToBeEdited.damage = damage;
  inspectionToBeEdited.remarks = remarks;
  inspectionToBeEdited.signedBy = signedBy;
  try {
    await inspectionToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit vehicle inspection", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteVehicleInspection = async (req, res, next) => {
  const { vehicleInspectionId } = req.params;
  try {
    await vehicleInspectionModel.findByIdAndRemove(vehicleInspectionId);
  } catch (error) {
    res.json({
      message: "Could not found the specific vehicle",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addVehicleInspection = addVehicleInspection;
exports.getVehicleInspection = getVehicleInspection;
exports.editVehicleInspection = editVehicleInspection;
exports.deleteVehicleInspection = deleteVehicleInspection;
