const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const offenceCon = require("../controllers/offence");
router.get("/", offenceCon.getOffences);
router.post("/addOffence", offenceCon.addOffences);
router.patch("/:offenceId", offenceCon.editOffences);
router.delete("/:offenceId", offenceCon.deleteOffences);
module.exports = router;
