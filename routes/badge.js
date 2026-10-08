const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var multer = require("multer");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
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
const badgeCon = require("../controllers/badge");
router.get("/", badgeCon.getBadge);
router.get("/searchBadge/", badgeCon.getSearchBadge);
router.post("/addBadge", badgeCon.addBadge);
router.patch("/:badgeId", badgeCon.editBadge);
router.delete("/:badgeId", badgeCon.deleteBadge);
router.patch("/addFiles/:badgeId", badgeCon.addFiles);
router.patch("/editFiles/:badgeId", badgeCon.editFiles);
router.patch("/delFiles/:badgeId&&:attachmentId", badgeCon.delFiles);
module.exports = router;
