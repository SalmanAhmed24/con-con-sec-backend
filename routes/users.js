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
const userCon = require("../controllers/user.js");
router.get("/", userCon.getUsers);
router.post("/addUser", userCon.addUser);
router.patch("/:userId", userCon.editUser);
router.delete("/:userId", userCon.deleteUser);
router.patch("/addBadges/:userId", userCon.addBadges);
router.patch("/editBadges/:userId", userCon.editBadges);
router.patch("/addNotes/:userId", userCon.addNotes);
router.patch("/editNotes/:userId", userCon.editNotes);
router.delete("/delNotes/:userId&&:noteId", userCon.delNotes);
router.patch(
  "/setTaskEmailNotification/:userId",
  userCon.setTaskEmailNotification
);
router.patch("/setTaskNotification/:userId", userCon.setTaskNotification);
router.patch("/addFiles/:userId", userCon.addFiles);
router.patch("/editFiles/:userId", userCon.editFiles);
router.patch("/delFiles/:userId&&:attachmentId", userCon.delFiles);
router.put("/assignForeman", userCon.assignForeman);
router.put("/assignJourneyman", userCon.assignJourneyman);
router.put("/assignApprentice", userCon.assignApprentice);
router.put("/assignConstruction", userCon.assignConstruction);
router.get("/:name", userCon.getUserByName);
router.get("/search/:position", userCon.getUserByPosition);
router.post("/addSchedule/:userId", userCon.addSchedule);
router.delete("/deleteSchedule/:userId&&:scheduleId", userCon.delSchedule);
router.post("/editSchedule/:userId", userCon.editSchedule);
router.post("/login", userCon.loginUser);
module.exports = router;
