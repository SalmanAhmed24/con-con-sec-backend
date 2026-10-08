const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const vendorCon = require("../controllers/vendor");
router.get("/", vendorCon.getVendor);
router.post("/addVendor", vendorCon.addVendor);
router.patch("/:vendorId", vendorCon.editVendor);
router.delete("/:vendorId", vendorCon.deleteVendor);
router.put("/addVendorLocation/:vendorId", vendorCon.addVendorLocation);
router.patch(
  "/editVendorLocation/:vendorId&&:vendorLocationId",
  vendorCon.editVendorLocation
);
router.delete(
  "/deleteVendorLocation/:vendorId&&:vendorLocationId",
  vendorCon.deleteVendorLocation
);
module.exports = router;
