const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const reimbursalTypeCon = require("../controllers/reimbursalType.js");
router.get("/", reimbursalTypeCon.getReimbursalsType);
router.post("/addReimbursalType", reimbursalTypeCon.addReimbursalType);
router.patch("/:reimbursalTypeId", reimbursalTypeCon.editReimbursalType);
router.delete("/:reimbursalTypeId", reimbursalTypeCon.deleteReimbursalType);
module.exports = router;
