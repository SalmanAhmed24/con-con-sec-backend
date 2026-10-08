const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const chatCon = require("../controllers/chat");
router.get("/", chatCon.getChat);
router.get("/:userId", chatCon.getChat);
router.post("/addChat", chatCon.addChat);
router.post("/seenBy/:chatId", chatCon.seenBy);
module.exports = router;
