const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const phaseCon = require("../controllers/phase.js");
router.get("/", phaseCon.getPhase);
router.post("/addphase", phaseCon.addphase);
router.patch("/:phaseId", phaseCon.editphase);
router.delete("/:phaseId", phaseCon.deletephase);
module.exports = router;
