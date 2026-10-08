const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const trackingCon = require("../controllers/tracking");
router.get("/", trackingCon.getTracking);
router.post("/addTracking", trackingCon.addTracking);
router.patch("/:trackingId", trackingCon.editTracking);
router.delete("/:trackingId", trackingCon.deleteTracking);
module.exports = router;
