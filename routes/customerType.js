const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const customerTypeCon = require("../controllers/customerType.js");
router.get("/", customerTypeCon.getCustomerType);
router.post("/addCustomerType", customerTypeCon.addCustomerType);
router.patch("/:customerTypeId", customerTypeCon.editCustomerType);
router.delete("/:customerTypeId", customerTypeCon.deleteCustomerType);
module.exports = router;
