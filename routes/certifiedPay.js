const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const router = express.Router();
router.use(
  multer({
    limits: {
      fieldSize: 15 * 1024 * 1024,
      fileSize: 15 * 1024 * 1024,
    },
  }).array(["files"], 12),
);
// user controllers
const certifiedPayCon = require("../controllers/certifiedPay");
router.get("/", certifiedPayCon.getCertifiedPay);
router.post("/addCertifiedPay", certifiedPayCon.addCertifiedPay);
router.patch("/:certifiedPayId", certifiedPayCon.editCertifiedPay);
router.delete("/:certifiedPayId", certifiedPayCon.deleteCertifiedPay);
module.exports = router;
