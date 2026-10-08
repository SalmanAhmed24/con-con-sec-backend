const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
var multer = require("multer");

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
const writeUpCon = require("../controllers/writeUp");
router.get("/", writeUpCon.getWriteUp);
router.post("/addWriteUp", writeUpCon.addWriteUp);
router.patch("/:writeUpId", writeUpCon.editWriteUp);
router.delete("/:writeUpId", writeUpCon.deleteWriteUp);
router.patch("/addSignature/:writeUpId", writeUpCon.addSignature);
router.patch("/deleteSignature/:writeUpId", writeUpCon.deleteSignature);
module.exports = router;
