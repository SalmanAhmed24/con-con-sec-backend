const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const storageLocationCon = require("../controllers/storageLocation");
router.get("/", storageLocationCon.getStorageLocation);
router.post("/addStorageLocation", storageLocationCon.addStorageLocation);
router.patch("/:storageLocationId", storageLocationCon.editStorageLocation);
router.delete("/:storageLocationId", storageLocationCon.deleteStorageLocation);
module.exports = router;
