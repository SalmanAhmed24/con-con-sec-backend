const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobCon = require("../controllers/job.js");
router.get("/", jobCon.getJob);
router.post("/addJob", jobCon.addJob);
router.patch("/:job_id", jobCon.editJob);
router.delete("/:job_id", jobCon.deleteJob);
module.exports = router;
