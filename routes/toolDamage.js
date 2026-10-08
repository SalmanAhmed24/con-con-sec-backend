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
const toolDamageCon = require("../controllers/toolDamage");
router.get("/", toolDamageCon.gettoolDamage);
router.post("/addtoolDamage", toolDamageCon.addtoolDamage);
router.patch("/:toolDamageId", toolDamageCon.edittoolDamage);
router.put("/:toolDamageId", toolDamageCon.deltoolDamage);
module.exports = router;
