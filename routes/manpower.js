const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const manpowerCon = require("../controllers/manpower");
router.get("/", manpowerCon.getManpower);
router.get("/searchByJob/:jobNumber", manpowerCon.getManpowerByJob);
router.get("/searchByPM/:PM", manpowerCon.getManpowerByPM);
router.get("/searchByDate/", manpowerCon.getManpowerByDate);
router.post("/addManpower", manpowerCon.addManpower);
router.patch("/:manpowerId", manpowerCon.editManpower);
router.patch("/assignEmployee/:manpowerId", manpowerCon.assignEmp);
router.put("/:manpowerId&&:jobNo", manpowerCon.deleteManpower);
module.exports = router;
