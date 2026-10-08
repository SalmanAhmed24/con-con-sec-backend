const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const overstockCatCon = require("../controllers/overstockCategories.js");
router.get("/", overstockCatCon.getOverstockCat);
router.post("/addOverstockCat", overstockCatCon.addOverstockCat);
router.patch("/:overstockCatId", overstockCatCon.editOverstockCat);
router.delete("/:overstockCatId", overstockCatCon.deleteOverstockCat);
module.exports = router;
