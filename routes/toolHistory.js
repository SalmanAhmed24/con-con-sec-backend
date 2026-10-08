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
const toolHistoryCon = require("../controllers/toolHistory");
router.get("/", toolHistoryCon.getToolHistory);
router.get("/searchTool/", toolHistoryCon.searchToolHistory);
router.post("/addToolHistory", toolHistoryCon.addToolHistory);
router.patch("/:toolHistoryId", toolHistoryCon.editToolHistory);
router.put("/:toolHistoryId", toolHistoryCon.deleteToolHistory);

module.exports = router;
