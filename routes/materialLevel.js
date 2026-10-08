const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const materialLevelCon = require("../controllers/materialLevel.js");
router.get("/", materialLevelCon.getmaterialLevel);
router.post("/addmaterialLevel", materialLevelCon.addmaterialLevel);
router.patch("/:materialLevelId", materialLevelCon.editmaterialLevel);
router.delete("/:materialLevelId", materialLevelCon.deletematerialLevel);
module.exports = router;
