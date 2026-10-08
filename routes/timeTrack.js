const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const timeTrackCon = require("../controllers/timeTrack.js");
router.get("/", timeTrackCon.getTimeTrack);
router.get("/:search", timeTrackCon.getByEmp);
router.get("/searchByJob/:jobDescription", timeTrackCon.getDataByJob);
router.post("/addtimeTrack", timeTrackCon.addTimeTrack);
router.patch("/:timeTrackId", timeTrackCon.editTimeTrack);
router.delete("/:timeTrackId", timeTrackCon.deleteTimeTrack);
module.exports = router;
