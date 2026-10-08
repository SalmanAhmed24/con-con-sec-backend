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
  }).array(["files"], 12)
);

// user controllers
const trainingCon = require("../controllers/training");
router.get("/", trainingCon.getTraining);
router.post("/addTraining", trainingCon.addTraining);
router.patch("/editTraining/:trainId", trainingCon.editTraining);
router.patch("/assignTraining/:trainId", trainingCon.assignTraining);
router.patch("/completeTraining/:trainId", trainingCon.completeTraining);
router.put("/deleteTraining/:trainingId", trainingCon.deleteTraining);

module.exports = router;
