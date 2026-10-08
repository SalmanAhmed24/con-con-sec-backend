const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const sheetDataCon = require("../controllers/getSheetData");
router.get("/", sheetDataCon.syncDataFromSheet);
router.post("/addSingleJob/", sheetDataCon.addSingleData);
router.post("/addDataToSheet/", sheetDataCon.syncDataToSheet);
router.put("/editSingleJob/", sheetDataCon.editResult);
router.delete("/:jobNumber", sheetDataCon.deleteResult);
module.exports = router;
