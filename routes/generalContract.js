const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const generalContractCon = require("../controllers/generalContract");
router.get("/", generalContractCon.getGeneralContract);
router.post("/addGeneralContract", generalContractCon.addGeneralContract);
router.patch("/:contractId", generalContractCon.editGeneralContract);
router.delete("/:contractId", generalContractCon.deleteGeneralContract);
module.exports = router;
