const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const purchaseOrderCon = require("../controllers/purchaseOrder");
router.get("/", purchaseOrderCon.getPurchaseOrder);
router.post("/addPurchaseOrder", purchaseOrderCon.addPurchaseOrder);
router.patch("/:purchaseId", purchaseOrderCon.editPurchaseOrder);
router.delete("/:purchaseId", purchaseOrderCon.deletePurchaseOrder);
module.exports = router;
