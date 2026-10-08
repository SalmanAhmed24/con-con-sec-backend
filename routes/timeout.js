const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const timeoutCon = require("../controllers/timeout");
router.get("/", timeoutCon.getTimeout);
router.post("/addTimeout", timeoutCon.addTimeout);
router.patch("/:timeoutId", timeoutCon.editTimeout);
router.patch("/changeStatus/:timeoutId", timeoutCon.changeStatus);
router.delete("/:timeoutId", timeoutCon.deleteTimeout);
module.exports = router;