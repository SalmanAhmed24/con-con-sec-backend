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
const servicesCon = require("../controllers/services");
router.get("/", servicesCon.getServices);
router.get("/searchService/", servicesCon.getBySearch);
router.post("/addService", servicesCon.addServices);
router.post("/addPayments/:serviceId", servicesCon.addPayments);
router.patch("/editPayments/:serviceId&&:paymentId", servicesCon.editPayments);
router.patch(
  "/deletePayments/:serviceId&&:paymentId",
  servicesCon.deletePayments
);
router.patch("/setDeleteFlag/:serviceId", servicesCon.setDeleteFlag);
router.patch("/setRestore/:serviceId", servicesCon.setRestore);

router.patch("/:serviceId", servicesCon.editServices);
router.patch("/setAssignTo/:serviceId", servicesCon.setAssignTo);
router.patch("/setRemaining/:serviceId", servicesCon.setRemaining);
router.patch("/delete/:serviceId", servicesCon.deleteServices);
router.patch("/addFiles/:serviceId", servicesCon.addFiles);
router.patch("/editFiles/:serviceId", servicesCon.editFiles);
router.patch("/delFiles/:serviceId&&:attachmentId", servicesCon.delFiles);
router.patch("/addSignature/:serviceId", servicesCon.addSignature);
router.patch("/delSignature/:serviceId", servicesCon.deleteSignature);
module.exports = router;
