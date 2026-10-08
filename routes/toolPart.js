const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const toolPartCon = require("../controllers/toolPart");
router.get("/", toolPartCon.getToolPart);
router.post("/addToolPart", toolPartCon.addToolPart);
router.patch("/:toolPartId", toolPartCon.editToolPart);
router.delete("/:toolPartId", toolPartCon.deleteToolPart);
module.exports = router;
