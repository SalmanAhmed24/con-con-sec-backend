const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const deviceCon = require("../controllers/devices.js");
router.get("/", deviceCon.getDevice);
router.post("/addDevice", deviceCon.addDevice);
router.patch("/:deviceId", deviceCon.editDevice);
router.delete("/:deviceId", deviceCon.deleteDevice);
module.exports = router;
