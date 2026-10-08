const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const toolCategoryCon = require("../controllers/toolCategory.js");
router.get("/", toolCategoryCon.gettoolCategory);
router.post("/addtoolCategory", toolCategoryCon.addtoolCategory);
router.patch("/:toolCategoryId", toolCategoryCon.edittoolCategory);
router.delete("/:toolCategoryId", toolCategoryCon.deletetoolCategory);
module.exports = router;
