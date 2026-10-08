const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const brandCon = require("../controllers/brand.js");
router.get("/", brandCon.getbrand);
router.post("/addbrand", brandCon.addbrand);
router.patch("/:brandId", brandCon.editbrand);
router.delete("/:brandId", brandCon.deletebrand);
module.exports = router;
