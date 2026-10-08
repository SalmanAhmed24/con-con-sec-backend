const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobPMCon = require("../controllers/jobPM.js");
router.get("/", jobPMCon.getJobPM);
router.post("/addJobPM", jobPMCon.addJobPM);
router.patch("/:jobPMId", jobPMCon.editJobPM);
router.delete("/:jobPMId", jobPMCon.deleteJobPM);
module.exports = router;
