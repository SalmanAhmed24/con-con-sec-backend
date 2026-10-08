const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const notesStatusCon = require("../controllers/notesStatus.js");
router.get("/", notesStatusCon.getnotesStatus);
router.post("/addnotesStatus", notesStatusCon.addnotesStatus);
router.patch("/:notesStatusId", notesStatusCon.editnotesStatus);
router.delete("/:notesStatusId", notesStatusCon.deletenotesStatus);
module.exports = router;
