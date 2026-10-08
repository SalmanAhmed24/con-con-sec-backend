const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  text: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  seenBy: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    default: [],
  },
});
module.exports = mongoose.model("messages", messageSchema);
