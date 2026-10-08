const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const timeoutReason = require("../controllers/timeoutReason");
router.get("/", timeoutReason.getTimeoutReason);
router.post("/addTimeoutReason", timeoutReason.addTimeoutReason);
router.patch("/:reasonId", timeoutReason.editTimeoutReason);
router.delete("/:reasonId", timeoutReason.deleteTimeoutReason);
module.exports = router;
