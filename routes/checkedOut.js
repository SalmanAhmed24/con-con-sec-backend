const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const checkedOutCon = require("../controllers/checkedOut.js");
router.get("/", checkedOutCon.getCheckedOut);
router.post("/addCheckedOut", checkedOutCon.addCheckedOut);
router.patch("/:checkedOutId", checkedOutCon.editCheckedOut);
router.delete("/:checkedOutId", checkedOutCon.deleteCheckedOut);
module.exports = router;
