const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobCTMCon = require("../controllers/jobCTM.js");
router.get("/", jobCTMCon.getJobCTM);
router.post("/addJobCTM", jobCTMCon.addJobCTM);
router.patch("/:jobCTMId", jobCTMCon.editJobCTM);
router.delete("/:jobCTMId", jobCTMCon.deleteJobCTM);
module.exports = router;
