const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const toolReqCon = require("../controllers/toolRequest");
router.get("/", toolReqCon.getToolRequestModel);
router.post("/addToolRequest", toolReqCon.addToolRequestModel);
router.patch("/:toolRequestId", toolReqCon.editToolRequestModel);
router.patch("/toolApproval/:toolRequestId", toolReqCon.handleToolApproval);
router.patch("/changeStatus/:toolRequestId", toolReqCon.setStatus);
router.patch("/addToolNumber/:toolRequestId", toolReqCon.setToolNumber);
router.delete("/:toolRequestId", toolReqCon.deleteToolRequestModel);
module.exports = router;
