const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const tagoutCon = require("../controllers/tagout");
router.get("/", tagoutCon.getTagout);
router.post("/addTagout", tagoutCon.addTagout);
router.patch("/:tagoutId", tagoutCon.editTagout);
router.delete("/:tagoutId", tagoutCon.deleteTagout);
module.exports = router;
