const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const positionCon = require("../controllers/position.js");
router.get("/", positionCon.getposition);
router.post("/addposition", positionCon.addposition);
router.patch("/:positionId", positionCon.editposition);
router.delete("/:positionId", positionCon.deleteposition);
module.exports = router;
