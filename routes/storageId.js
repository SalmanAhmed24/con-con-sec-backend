const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const storageIdCon = require("../controllers/storageId");
router.get("/", storageIdCon.getStorageId);
router.post("/addStorageId", storageIdCon.addStorageId);
router.patch("/:storage", storageIdCon.editStorageId);
router.delete("/:storage", storageIdCon.deleteStorageId);
module.exports = router;
