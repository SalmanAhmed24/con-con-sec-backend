const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const trainingCategoryCon = require("../controllers/trainingCategory");
router.get("/", trainingCategoryCon.getTrainingCategory);
router.post("/addTrainingCategory", trainingCategoryCon.addTrainingCategory);
router.patch("/:trainingCategoryId", trainingCategoryCon.editTrainingCategory);
router.delete(
  "/:trainingCategoryId",
  trainingCategoryCon.deleteTrainingCategory
);
module.exports = router;
