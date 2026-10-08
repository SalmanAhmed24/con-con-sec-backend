const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
router.use(
  multer({
    limits: {
      fieldSize: 8 * 1024 * 1024,
      fileSize: 8 * 1024 * 1024,
    },
  }).array("files", 12)
);

// user controllers
const toolTrackCon = require("../controllers/serviceToolTrack");
router.get("/", toolTrackCon.getToolTrack);
router.get("/search/", toolTrackCon.searchFilter);
router.post("/addToolTrack", toolTrackCon.addToolTrack);
router.patch("/editToolTrack/:toolTrackId", toolTrackCon.editToolTrack);
router.patch("/changeLocation/", toolTrackCon.changeLocation);
router.put(
  "/deleteToolTrack/:toolTrackId&&:fullname",
  toolTrackCon.deleteToolTrack
);

module.exports = router;
