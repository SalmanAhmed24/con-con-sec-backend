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
      fieldSize: 8 * 1024 * 1024,
      fileSize: 8 * 1024 * 1024,
    },
  }).array(["files"], 12)
);

// user controllers
const toolsCon = require("../controllers/tools.js");
router.get("/", toolsCon.getTools);
router.patch("/findSerial/:serial", toolsCon.findSerial);
router.post("/addTools", toolsCon.addTools);
router.patch("/:toolId", toolsCon.editTools);
router.put("/:toolId", toolsCon.delTools);
// router.patch("/addInfo/:toolId", toolsCon.addInfo);
// router.patch("/editInfo/:toolId", toolsCon.editInfo);
router.post("/addPartsItems/:toolId", toolsCon.addPartsItem);
router.patch("/editPartsItems/:toolId&&:partId", toolsCon.editPartsItem);
router.delete("/deletePartsItems/:toolId&&:partId", toolsCon.delPartsItem);
router.patch("/addFiles/:toolId", toolsCon.addFiles);
router.patch("/editFiles/:toolId", toolsCon.editFiles);
router.patch("/delFiles/:toolId&&:attachmentId", toolsCon.delFiles);
router.get("/:toolNo&&:searchValue", toolsCon.getToolByNo);
router.post("/addHistory/", toolsCon.addHistory);

module.exports = router;
