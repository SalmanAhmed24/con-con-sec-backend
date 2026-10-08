const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const taskCategoryCon = require("../controllers/taskCategory.js");
router.get("/", taskCategoryCon.gettaskCategory);
router.post("/addtaskCategory", taskCategoryCon.addtaskCategory);
router.patch("/:taskCategoryId", taskCategoryCon.edittaskCategory);
router.delete("/:taskCategoryId", taskCategoryCon.deletetaskCategory);
module.exports = router;
