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
const serviceToolsCon = require("../controllers/serviceTools.js");
router.get("/", serviceToolsCon.getTools);
router.post("/addTools", serviceToolsCon.addTools);
router.patch("/:serviceToolId", serviceToolsCon.editTools);
router.put("/:serviceToolId", serviceToolsCon.delTools);
// router.patch("/addInfo/:serviceToolId", serviceToolsCon.addInfo);
// router.patch("/editInfo/:serviceToolId", serviceToolsCon.editInfo);
router.post("/addPartsItems/:serviceToolId", serviceToolsCon.addPartsItem);
router.patch(
  "/editPartsItems/:serviceToolId&&:partId",
  serviceToolsCon.editPartsItem
);
router.delete(
  "/deletePartsItems/:serviceToolId&&:partId",
  serviceToolsCon.delPartsItem
);
router.patch("/addFiles/:serviceToolId", serviceToolsCon.addFiles);
router.patch("/editFiles/:serviceToolId", serviceToolsCon.editFiles);
router.patch(
  "/delFiles/:serviceToolId&&:attachmentId",
  serviceToolsCon.delFiles
);
router.get("/:toolNo&&:searchValue", serviceToolsCon.getToolByNo);
router.post("/addHistory/", serviceToolsCon.addHistory);

module.exports = router;
