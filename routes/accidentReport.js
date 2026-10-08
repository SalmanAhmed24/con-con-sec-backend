const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const accidentReportCon = require("../controllers/accidentReport.js");
router.get("/", accidentReportCon.getAccidentReport);
router.post("/addAccidentReport", accidentReportCon.addAccidentReport);
router.patch("/:accidentReportId", accidentReportCon.editAccidentReport);
router.delete("/:accidentReportId", accidentReportCon.deleteAccidentReport);
module.exports = router;
