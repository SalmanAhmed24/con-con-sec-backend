const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobTypeCon = require("../controllers/jobType.js");
router.get("/", jobTypeCon.getJobType);
router.post("/addJobType", jobTypeCon.addJobType);
router.patch("/:jobTypeId", jobTypeCon.editJobType);
router.delete("/:jobTypeId", jobTypeCon.deleteJobType);
module.exports = router;
