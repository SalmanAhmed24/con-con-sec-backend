const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const jobTagCon = require("../controllers/jobTag.js");
router.get("/", jobTagCon.getJobTag);
router.post("/addJobTag", jobTagCon.addJobTag);
router.patch("/:jobTagId", jobTagCon.editJobTag);
router.delete("/:jobTagId", jobTagCon.deleteJobTag);
module.exports = router;
