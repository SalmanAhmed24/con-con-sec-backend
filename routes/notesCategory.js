const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const notesCategoryCon = require("../controllers/notesCategory.js");
router.get("/", notesCategoryCon.getnotesCategory);
router.post("/addnotesCategory", notesCategoryCon.addnotesCategory);
router.patch("/:notesCategoryId", notesCategoryCon.editnotesCategory);
router.delete("/:notesCategoryId", notesCategoryCon.deletenotesCategory);
module.exports = router;
