const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobSourcesCon = require("../controllers/jobSources");
router.get("/", jobSourcesCon.getJobSources);
router.post("/addJobSources", jobSourcesCon.addJobSources);
router.patch("/:jobSourcesId", jobSourcesCon.editJobSources);
router.delete("/:jobSourcesId", jobSourcesCon.deleteJobSources);
module.exports = router;
