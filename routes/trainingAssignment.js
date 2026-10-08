const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const router = express.Router();
router.use(
  multer({
    limits: {
      fieldSize: 15 * 1024 * 1024,
      fileSize: 15 * 1024 * 1024,
    },
  }).array(["files"], 12),
);

// user controllers
const trainingCon = require("../controllers/trainingAssignment");
router.get("/", trainingCon.getTrainingAssignments);
router.post("/addTrainAssignment", trainingCon.addTrainingAssignments);
router.patch(
  "/editTrainAssignment/:trainAssignmentId",
  trainingCon.editTrainingAssignment,
);
// router.patch("/assignTraining/:trainId", trainingCon.assignTraining);
router.patch(
  "/completeTraining/:trainAssignmentId",
  trainingCon.completeTraining,
);
router.put(
  "/deleteTrainAssignment/:trainAssignmentId",
  trainingCon.deleteTraining,
);

module.exports = router;
