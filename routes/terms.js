const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const termCon = require("../controllers/terms");
router.get("/", termCon.getTerms);
router.post("/addTerms", termCon.addTerms);
router.patch("/:termsId", termCon.editTerms);
router.delete("/:termsId", termCon.deleteTerms);
module.exports = router;
