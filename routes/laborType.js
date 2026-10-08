const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const laborTypeCon = require("../controllers/laborType");
router.get("/", laborTypeCon.getLaborType);
router.post("/addLaborType", laborTypeCon.addLaborType);
router.patch("/:laborTypeId", laborTypeCon.editLaborType);
router.delete("/:laborTypeId", laborTypeCon.deleteLaborType);
module.exports = router;
