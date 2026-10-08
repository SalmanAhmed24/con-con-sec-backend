const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const toolTransferCon = require("../controllers/toolTransfer");
router.get("/", toolTransferCon.getToolTransfer);
router.post("/addToolTransfer", toolTransferCon.addToolTransfer);
router.patch("/:toolTransferId", toolTransferCon.editToolTransfer);
router.patch(
  "/setPickupAssignee/:toolTransferId",
  toolTransferCon.setPickUpAssignee
);
router.patch("/toolApproval/:toolTransferId", toolTransferCon.handleToolReturn);
router.patch(
  "/handlePickupFlag/:toolTransferId",
  toolTransferCon.handlePickupFlag
);
router.patch(
  "/handleAssignedFlag/:toolTransferId",
  toolTransferCon.handleAssignedFlag
);
router.patch("/returnShop/:toolTransferId", toolTransferCon.handleReturnShop);
router.delete("/:toolTransferId", toolTransferCon.deletetoolTransfer);
module.exports = router;
