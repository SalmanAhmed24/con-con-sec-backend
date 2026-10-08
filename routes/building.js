const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const buildingCon = require("../controllers/building");
router.get("/", buildingCon.getBuilding);
router.post("/addBuilding", buildingCon.addBuilding);
router.patch("/:buildingId", buildingCon.editBuilding);
router.delete("/:buildingId", buildingCon.deleteBuilding);
module.exports = router;
