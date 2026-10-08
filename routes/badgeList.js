const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const badgeListCon = require("../controllers/badgeList");
router.get("/", badgeListCon.getBadgeList);
router.post("/addBadgeList", badgeListCon.addBadgeList);
router.patch("/:badgeListId", badgeListCon.editBadgeList);
router.delete("/:badgeListId", badgeListCon.deleteBadgeList);
module.exports = router;
