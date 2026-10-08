const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(bodyParser.json({ limit: "250MB" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "250MB" }));
app.use(cors());

const router = express.Router();
router.use(
  multer({
    limits: {
      fieldSize: 8 * 1024 * 1024,
      fileSize: 8 * 1024 * 1024,
    },
  }).array("files", 12)
);
// user controllers
const clientCon = require("../controllers/client.js");
router.get("/", clientCon.getClient);
router.post("/addClient", clientCon.addClient);
router.post("/addInvoices/:clientId", clientCon.addInvoices);
router.patch(
  "/editPayments/:clientId&&:invoiceId&&:paymentId",
  clientCon.editPayments
);
router.patch(
  "/deletePayments/:clientId&&:invoiceId&&:paymentId",
  clientCon.deletePayments
);
router.patch("/editInvoices/:clientId&&:invoiceId", clientCon.editInvoices);
router.patch("/addPayments/:clientId&&:invoiceId", clientCon.addPayments);
router.patch(
  "/setInvoiceStatus/:clientId&&:invoiceId",
  clientCon.invoiceStatus
);
router.delete(
  "/deleteInvoices/:clientId&&:invoiceId",
  clientCon.deleteInvoices
);
router.patch("/:clientId", clientCon.editClient);
router.delete("/:clientId", clientCon.deleteClient);
router.get("/:name", clientCon.getCustomerByName);
router.get("/getInvoices/:clientId", clientCon.getInvoices);
router.get("/getAttachments/:clientId", clientCon.getAttachments);
router.patch("/addFiles/:clientId", clientCon.addFiles);
router.patch("/editFiles/:clientId", clientCon.editFiles);
router.patch("/delFiles/:clientId&&:attachmentId", clientCon.delFiles);
module.exports = router;
