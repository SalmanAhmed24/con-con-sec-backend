const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const overstockCon = require("../controllers/overstock");
router.get("/", overstockCon.getOverstock);
router.post("/addOverstock", overstockCon.addOverstock);
router.patch("/:overstockId", overstockCon.editOverstock);
router.delete("/:overstockId", overstockCon.deleteOverstock);
module.exports = router;
