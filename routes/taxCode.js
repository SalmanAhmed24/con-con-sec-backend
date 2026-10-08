const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const taxCodeCon = require("../controllers/taxCode.js");
router.get("/", taxCodeCon.gettaxCode);
router.post("/addtaxCode", taxCodeCon.addtaxCode);
router.patch("/:taxCodeId", taxCodeCon.edittaxCode);
router.delete("/:taxCodeId", taxCodeCon.deletetaxCode);
module.exports = router;
