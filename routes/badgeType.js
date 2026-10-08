const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const badgeTypeCon = require("../controllers/badgeType");
router.get("/", badgeTypeCon.getBadgeType);
router.post("/addBadgeType", badgeTypeCon.addBadgeType);
router.patch("/:badgeTypeId", badgeTypeCon.editBadgeType);
router.delete("/:badgeTypeId", badgeTypeCon.deleteBadgeType);
module.exports = router;
