const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobStatusCon = require("../controllers/jobStatus");
router.get("/", jobStatusCon.getJobStatus);
router.post("/addJobStatus", jobStatusCon.addJobStatus);
router.patch("/:jobStatusId", jobStatusCon.editJobStatus);
router.delete("/:jobStatusId", jobStatusCon.deleteJobStatus);
module.exports = router;
