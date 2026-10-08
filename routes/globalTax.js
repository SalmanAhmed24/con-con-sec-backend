const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const globalTaxCon = require("../controllers/globalTax.js");
router.get("/", globalTaxCon.getGlobalTax);
router.post("/addGlobalTax", globalTaxCon.addGlobalTax);
router.patch("/:id", globalTaxCon.editGlobalTax);
module.exports = router;
