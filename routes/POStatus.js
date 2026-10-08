const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const POStatusCpn = require("../controllers/POStatus");
router.get("/", POStatusCpn.getPOStatus);
router.post("/addPOStatus", POStatusCpn.addPOStatus);
router.patch("/:POStatusId", POStatusCpn.editPOStatus);
router.delete("/:POStatusId", POStatusCpn.deletePOStatus);
module.exports = router;
