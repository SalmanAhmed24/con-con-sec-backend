const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const serviceNumber = require("../controllers/serviceNumbers");
router.get("/", serviceNumber.getServiceNumber);
router.post("/addServiceNumber", serviceNumber.addServiceNumber);
router.patch("/:serviceNumberId", serviceNumber.editServiceNumber);
router.delete("/:serviceNumberId", serviceNumber.deleteServiceNumber);
module.exports = router;
