const trainingCategoryModel = require("../models/trainingCategory");
const addTrainingCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const createTrainingCategory = new trainingCategoryModel({
    name,
    shortCode,
  });
  try {
    await createTrainingCategory.save();
  } catch (error) {
    res.json({ message: "Error adding Training Category", error: true });
    return next(error);
  }
  res.json({ message: "Created Successfully", error: false });
};
const getTrainingCategory = async (req, res, next) => {
  let trainingCategorys;
  try {
    trainingCategorys = await trainingCategoryModel.find({});
  } catch (error) {
    res.json({ message: "Error finding Training Category list", error: true });
    return next(error);
  }
  res.json({
    trainingCategorys: trainingCategorys.map((item) =>
      item.toObject({ getters: true })
    ),
    error: false,
  });
};
const editTrainingCategory = async (req, res, next) => {
  const { name, shortCode } = req.body;
  const { trainingCategoryId } = req.params;
  let trainingCategoryToBeEdited;
  try {
    trainingCategoryToBeEdited = await trainingCategoryModel.findById(
      trainingCategoryId
    );
  } catch (error) {
    res.json({ message: "Could not find the Training Category", error: true });
    return next(error);
  }
  trainingCategoryToBeEdited.name = name;
  trainingCategoryToBeEdited.shortCode = shortCode;
  try {
    await trainingCategoryToBeEdited.save();
  } catch (error) {
    res.json({ message: "Enable to edit Training Category", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
};
const deleteTrainingCategory = async (req, res, next) => {
  const { trainingCategoryId } = req.params;
  try {
    await trainingCategoryModel.findByIdAndRemove(trainingCategoryId);
  } catch (error) {
    res.json({
      message: "Could not found the specific Training Category",
      error: true,
    });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};
exports.addTrainingCategory = addTrainingCategory;
exports.getTrainingCategory = getTrainingCategory;
exports.editTrainingCategory = editTrainingCategory;
exports.deleteTrainingCategory = deleteTrainingCategory;
