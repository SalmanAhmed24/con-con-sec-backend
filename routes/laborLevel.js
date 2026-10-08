const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const laborLevelCon = require("../controllers/laborLevel.js");
router.get("/", laborLevelCon.getlaborLevel);
router.post("/addlaborLevel", laborLevelCon.addlaborLevel);
router.patch("/:laborLevelId", laborLevelCon.editlaborLevel);
router.delete("/:laborLevelId", laborLevelCon.deletelaborLevel);
module.exports = router;
