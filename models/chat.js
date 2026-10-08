const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const chatSchema = new mongoose.Schema({
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    default: [],
  },
  messages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }],
    default: [],
  },
  isGroup: { type: Boolean, default: false },
  name: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  lastMessage: { type: Date, default: Date.now },
});
module.exports = mongoose.model("chats", chatSchema);
