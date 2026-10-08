const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const salesPersonCodeCon = require("../controllers/salesPerson.js");
router.get("/", salesPersonCodeCon.getsalesPersonCode);
router.post("/addsalesPersonCode", salesPersonCodeCon.addsalesPersonCode);
router.patch("/:salesPersonCodeId", salesPersonCodeCon.editsalesPersonCode);
router.delete("/:salesPersonCodeId", salesPersonCodeCon.deletesalesPersonCode);
module.exports = router;
