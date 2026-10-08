const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const vendorCategory = require("../controllers/vendorCategory.js");
router.get("/", vendorCategory.getVendorCat);
router.post("/addVendorCategory", vendorCategory.addVendorCategory);
router.patch("/:vendorCatId", vendorCategory.editVendorCat);
router.delete("/:vendorCatId", vendorCategory.deleteVendorCat);
module.exports = router;
