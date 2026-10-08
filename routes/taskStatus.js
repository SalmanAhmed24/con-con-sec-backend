const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const taskStatusCon = require("../controllers/taskStatus.js");
router.get("/", taskStatusCon.gettaskStatus);
router.post("/addtaskStatus", taskStatusCon.addtaskStatus);
router.patch("/:taskStatusId", taskStatusCon.edittaskStatus);
router.delete("/:taskStatusId", taskStatusCon.deletetaskStatus);
module.exports = router;
