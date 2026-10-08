const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
router.use(
  multer({
    limits: {
      fieldSize: 8 * 1024 * 1024,
      fileSize: 8 * 1024 * 1024,
    },
  }).array("files", 12)
);

// user controllers
const jobEstCon = require("../controllers/jobEstimates");
router.get("/", jobEstCon.getJobEstimate);
router.post("/addJobEstimate", jobEstCon.addJobEstimate);
router.patch("/:jobEstimateId", jobEstCon.editJobEstimate);

module.exports = router;
