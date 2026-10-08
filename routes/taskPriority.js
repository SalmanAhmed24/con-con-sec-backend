const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const taskPriorityCon = require("../controllers/taskPriority.js");
router.get("/", taskPriorityCon.gettaskPriority);
router.post("/addtaskPriority", taskPriorityCon.addtaskPriority);
router.patch("/:taskPriorityId", taskPriorityCon.edittaskPriority);
router.delete("/:taskPriorityId", taskPriorityCon.deletetaskPriority);
module.exports = router;
