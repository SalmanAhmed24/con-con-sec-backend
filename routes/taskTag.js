const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const taskTagCon = require("../controllers/taskTag");
router.get("/", taskTagCon.gettaskTag);
router.post("/addTaskTag", taskTagCon.addtaskTag);
router.patch("/:taskTagId", taskTagCon.edittaskTag);
router.delete("/:taskTagId", taskTagCon.deletetaskTag);
module.exports = router;
