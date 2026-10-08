const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();
// user controllers
const messageCon = require("../controllers/message");
// router.get("/", chatCon.getChat);
// router.get("/:userId", chatCon.getChat);
router.post("/addMessage", messageCon.addMessage);
module.exports = router;
