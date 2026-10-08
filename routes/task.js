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
const taskCon = require("../controllers/task.js");
router.get("/", taskCon.getTask);
router.get("/getTaskById/", taskCon.getTaskById);
router.post("/addTask", taskCon.addTask);
router.patch("/:taskId", taskCon.editTask);
router.delete("/:taskId", taskCon.deleteTask);
router.put("/addSubTask/:taskId", taskCon.addSubTask);
router.patch("/editSubTask/:taskId&&:subTaskId", taskCon.editSubTask);
router.delete("/delSubTask/:taskId&&:subTaskId", taskCon.delSubTasks);

router.put("/addTaskNote/:taskId", taskCon.addTaskNotes);
router.patch("/editTaskNote/:taskId&&:noteId", taskCon.editTaskNotes);
router.delete("/delTaskNote/:taskId&&:noteId", taskCon.delTasksNotes);
router.patch("/addFiles/:taskId", taskCon.addFiles);
router.patch("/editFiles/:taskId", taskCon.editFiles);
router.patch("/delFiles/:taskId&&:attachmentId", taskCon.delFiles);
module.exports = router;
