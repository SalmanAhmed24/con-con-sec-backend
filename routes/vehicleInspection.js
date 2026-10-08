const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const vehicleInspectionCon = require("../controllers/vehicleInspection.js");
router.get("/", vehicleInspectionCon.getVehicleInspection);
router.post("/addVehicleInspection", vehicleInspectionCon.addVehicleInspection);
router.patch(
  "/:vehicleInspectionId",
  vehicleInspectionCon.editVehicleInspection
);
router.delete(
  "/:vehicleInspectionId",
  vehicleInspectionCon.deleteVehicleInspection
);
module.exports = router;
