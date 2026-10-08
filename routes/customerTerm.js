const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const customerTermCon = require("../controllers/customerTerm.js");
router.get("/", customerTermCon.getCustomerTerm);
router.post("/addCustomerTerm", customerTermCon.addCustomerTerm);
router.patch("/:customerTermId", customerTermCon.editCustomerTerm);
router.delete("/:customerTermId", customerTermCon.deleteCustomerTerm);
module.exports = router;
