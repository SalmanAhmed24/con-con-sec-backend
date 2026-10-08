const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const warningCon = require("../controllers/warning");
router.get("/", warningCon.getWarning);
router.post("/addWarning", warningCon.addWarning);
router.patch("/:warningId", warningCon.editWarning);
router.delete("/:warningId", warningCon.deleteWarning);
module.exports = router;
