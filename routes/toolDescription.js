const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const toolDescriptionCon = require("../controllers/toolDescription");
router.get("/", toolDescriptionCon.getToolDescription);
router.post("/addToolDescription", toolDescriptionCon.addToolDescription);
router.patch("/:subtoolCategoryId", toolDescriptionCon.editToolDescription);
router.delete("/:subtoolCategoryId", toolDescriptionCon.deleteToolDescription);
module.exports = router;
