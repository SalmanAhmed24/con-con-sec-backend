const vendorModel = require("../models/vendors");
const addVendor = async (req, res, next) => {
  const {
    name,
    companyName,
    address,
    city,
    state,
    zipCode,
    primaryContact,
    phone,
    email,
    website,
    preferred,
    vendorCategory,
  } = req.body;
  const createvendorModel = new vendorModel({
    name,
    companyName,
    address,
    city,
    state,
    zipCode,
    primaryContact,
    phone,
    email,
    website,
    preferred,
    vendorCategory,
    locations: [],
  });
  try {
    await createvendorModel.save();
  } catch (error) {
    res.json({ message: "Error adding User Type", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getVendor = async (req, res, next) => {
  let vendors;
  try {
    vendors = await vendorModel.find({});
  } catch (error) {
    res.json({ message: "Error finding vendor list", error: true });
    return next(error);
  }
  res.json({
    vendors: vendors.map((item) => item.toObject({ getters: true })),
    error: false,
  });
};
const editVendor = async (req, res, next) => {
  const {
    name,
    companyName,
    address,
    city,
    state,
    zipCode,
    primaryContact,
    phone,
    email,
    website,
    preferred,
    vendorCategory,
  } = req.body;
  const { vendorId } = req.params;
  let vendorToBeEdited;
  try {
    vendorToBeEdited = await vendorModel.findById(vendorId);
  } catch (error) {
    res.json({ message: "Could not find the vendor", error: true });
    return next(error);
  }
  vendorToBeEdited.name = name;
  vendorToBeEdited.vendorCategory = vendorCategory;
  vendorToBeEdited.companyName = companyName;
  vendorToBeEdited.address = address;
  vendorToBeEdited.city = city;
  vendorToBeEdited.state = state;
  vendorToBeEdited.zipCode = zipCode;
  vendorToBeEdited.primaryContact = primaryContact;
  vendorToBeEdited.phone = phone;
  vendorToBeEdited.email = email;
  vendorToBeEdited.website = website;
  vendorToBeEdited.preferred = preferred;
  try {
    await vendorToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit vendor", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteVendor = async (req, res, next) => {
  const { vendorId } = req.params;
  try {
    await vendorModel.findByIdAndRemove(vendorId);
  } catch (error) {
    res.json({ message: "Could not found the specific vendor", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
const addVendorLocation = async (req, res, next) => {
  const {
    locationName,
    address,
    city,
    state,
    zipCode,
    primaryContact,
    phone,
    email,
  } = req.body;
  const { vendorId } = req.params;
  try {
    await vendorModel.findOneAndUpdate(
      { _id: vendorId },
      {
        $push: {
          locations: {
            locationName,
            address,
            city,
            state,
            zipCode,
            primaryContact,
            phone,
            email,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not add the location", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};
const editVendorLocation = async (req, res, next) => {
  let vendorLocationEdited;
  const {
    locationName,
    address,
    city,
    state,
    zipCode,
    primaryContact,
    phone,
    email,
  } = req.body;
  const { vendorId, vendorLocationId } = req.params;
  try {
    vendorLocationEdited = await vendorModel.findById(vendorId);
  } catch (error) {
    res.json({ message: "Could not find the Vendor", error: true });
    return next(error);
  }
  vendorLocationEdited.locations.forEach((i) => {
    if (i.id == vendorLocationId) {
      i.locationName = locationName;
      i.address = address;
      i.city = city;
      i.state = state;
      i.zipCode = zipCode;
      i.primaryContact = primaryContact;
      i.phone = phone;
      i.email = email;
    }
  });
  try {
    await vendorLocationEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Vendor Location", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteVendorLocation = async (req, res, next) => {
  const { vendorId, vendorLocationId } = req.params;
  try {
    await vendorModel.updateOne(
      { _id: vendorId },
      {
        $pull: {
          locations: { _id: vendorLocationId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the vendor", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addVendor = addVendor;
exports.getVendor = getVendor;
exports.editVendor = editVendor;
exports.deleteVendor = deleteVendor;
exports.addVendorLocation = addVendorLocation;
exports.editVendorLocation = editVendorLocation;
exports.deleteVendorLocation = deleteVendorLocation;
