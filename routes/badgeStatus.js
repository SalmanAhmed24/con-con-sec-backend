const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const badgeStatus = require("../controllers/badgeStatus");
router.get("/", badgeStatus.getBadgeStatus);
router.post("/addBadgeStatus", badgeStatus.addBadgeStatus);
router.patch("/:badgeStatusId", badgeStatus.editBadgeStatus);
router.delete("/:badgeStatusId", badgeStatus.deleteBadgeStatus);
module.exports = router;
