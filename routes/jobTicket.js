const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var multer = require("multer");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
router.use(
  multer({
    limits: {
      fieldSize: 8 * 1024 * 1024,
      fileSize: 8 * 1024 * 1024,
    },
  }).array(["files"], 12)
);
// user controllers
const jobTicketCon = require("../controllers/jobTicket");
router.get("/", jobTicketCon.getJobTickets);
router.get("/searchJobTicket/", jobTicketCon.getBySearch);
router.post("/addJobTicket", jobTicketCon.addJobTickets);
router.post("/addPayments/:jobTicketId", jobTicketCon.addPayments);
router.patch(
  "/editPayments/:jobTicketId&&:paymentId",
  jobTicketCon.editPayments
);
router.patch(
  "/deletePayments/:jobTicketId&&:paymentId",
  jobTicketCon.deletePayments
);

router.patch("/setAssignTo/:jobTicketId", jobTicketCon.setAssignTo);
router.patch("/setDeleteFlag/:jobTicketId", jobTicketCon.setDeleteFlag);
router.patch("/setRestore/:jobTicketId", jobTicketCon.setRestore);
router.patch("/:jobTicketId", jobTicketCon.editJobTickets);
router.patch("/setRemaining/:jobTicketId", jobTicketCon.setRemaining);
router.patch("/delete/:jobTicketId", jobTicketCon.deleteJobTickets);
router.patch("/addFiles/:jobTicketId", jobTicketCon.addFiles);
router.patch("/editFiles/:jobTicketId", jobTicketCon.editFiles);
router.patch("/delFiles/:jobTicketId&&:attachmentId", jobTicketCon.delFiles);
router.patch("/addSignature/:jobTicketId", jobTicketCon.addSignature);
router.patch("/delSignature/:jobTicketId", jobTicketCon.deleteSignature);
module.exports = router;
