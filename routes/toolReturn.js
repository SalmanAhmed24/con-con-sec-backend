const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const toolRetCon = require("../controllers/toolReturn");
router.get("/", toolRetCon.gettoolReturnModel);
router.post("/addToolReturn", toolRetCon.addtoolReturnModel);
router.patch("/:toolReturnId", toolRetCon.edittoolReturnModel);
router.patch("/setPickupAssignee/:toolReturnId", toolRetCon.setPickUpAssignee);
router.patch("/toolApproval/:toolReturnId", toolRetCon.handleToolReturn);
router.patch("/handlePickupFlag/:toolReturnId", toolRetCon.handlePickupFlag);
router.patch(
  "/handleAssignedFlag/:toolReturnId",
  toolRetCon.handleAssignedFlag
);
router.patch("/returnShop/:toolReturnId", toolRetCon.handleReturnShop);
router.delete("/:toolReturnId", toolRetCon.deletetoolReturnModel);
module.exports = router;
