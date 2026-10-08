const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json({ limit: "250MB" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "250MB" }));
app.use(cors());
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
  region: process.env.AWS_BUCKET_REGION,
});
const multer = require("multer");

const router = express.Router();
// user controllers
router.use(
  multer({
    limits: {
      fieldSize: 8 * 1024 * 1024,
      fileSize: 8 * 1024 * 1024,
    },
  }).array("files", 12)
);
const userCon = require("../controllers/manpowerUsers");
router.get("/:jobNo", userCon.getUsersLabors);
router.post("/editTimeTrack/:manpowerId", userCon.editTimeTrack);
router.post("/setCheckIn/:manpowerId", userCon.setCheckIn);
router.post("/setCheckOut/:manpowerId", userCon.setCheckOut);
router.post("/setLunchTime/:manpowerId", userCon.setLunchTime);
router.post("/setLaborNotes/:manpowerId", userCon.setNotes);
router.post("/setReimbursal/:manpowerId", userCon.setReimbursal);
router.post("/setSpectrum/:manpowerId", userCon.setSpectrum);
router.post("/setGroupValues/", userCon.setGroupValues);
module.exports = router;
