const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

const router = express.Router();
router.use(
  multer({
    limits: { fileSize: 1024 * 1024 * 300 },
  }).array(["files"], 12)
);

// user controllers
const toolsCon = require("../controllers/allTools");
router.get("/", toolsCon.getTools);
router.post("/addTools", toolsCon.addTools);
router.post("/uploadPicture", toolsCon.uploadPictures);
router.patch("/editTool/:toolId", toolsCon.editTools);
router.put("/:toolId", toolsCon.delTools);
router.delete("/deletePicture", toolsCon.deletePictures);
router.get("/:toolNo&&:searchValue", toolsCon.getToolByNo);
router.patch("/findSerial/:serial", toolsCon.findSerial);
// router.patch("/addInfo/:toolId", toolsCon.addInfo);
// router.patch("/editInfo/:toolId", toolsCon.editInfo);
// router.post("/addPartsItems/:toolId", toolsCon.addPartsItem);
// router.patch("/editPartsItems/:toolId&&:partId", toolsCon.editPartsItem);
// router.delete("/deletePartsItems/:toolId&&:partId", toolsCon.delPartsItem);
// router.patch("/addFiles/:toolId", toolsCon.addFiles);
// router.patch("/editFiles/:toolId", toolsCon.editFiles);
// router.patch("/delFiles/:toolId&&:attachmentId", toolsCon.delFiles);
// router.get("/:toolNo&&:searchValue", toolsCon.getToolByNo);
// router.post("/addHistory/", toolsCon.addHistory);

module.exports = router;
