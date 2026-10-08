const chatModel = require("../models/chat");
const userModel = require("../models/userModel");
const messageModel = require("../models/message");
const chat = require("../models/chat");
const Pusher = require("pusher");
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECERET,
  cluster: "ap2",
  useTLS: true,
});
const addMessage = async (req, res, next) => {
  const { currentUserId, chatId, text } = req.body;
  var updatedChat;
  var newMessage;
  try {
    const currentUser = await userModel.findById(currentUserId);
    newMessage = await messageModel.create({
      chat: chatId,
      sender: {
        fullname: currentUser.fullname,
        email: currentUser.email,
        _id: currentUser._id,
      },
      text: text,
      seenBy: currentUserId,
    });
  } catch (error) {
    console.log(error);
  }
  try {
    updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $push: { messages: newMessage._id },
          $set: { lastMessage: newMessage.createdAt },
        },
        { new: true }
      )
      .populate({
        path: "messages",
        model: messageModel,
        populate: {
          path: "sender seenBy",
          select: "fullname email",
          model: userModel,
        },
      })
      .populate({
        path: "members",
        select: "fullname email",
        model: userModel,
      })
      .exec();
  } catch (error) {
    console.log(error);
  }
  try {
    await pusherServer.trigger(chatId, "new-message", newMessage);
  } catch (error) {
    console.log(error);
  }
  const filteredData = updatedChat.members.map((i) => {
    return { memberId: i._id };
  });

  const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

  filteredData.forEach(async (member) => {
    var dataObj = {
      id: chatId,
      messages: [
        {
          _id: lastMessage._id,
          chat: lastMessage.chat,
          sender: {
            _id: lastMessage.sender._id,
            fullname: lastMessage.sender.fullname,
          },
          text: lastMessage.text,
          seenBy: lastMessage.seenBy.map((i) => {
            return { _id: i._id, fullname: i.fullname };
          }),
        },
      ],
    };

    try {
      await pusherServer.trigger(`${member.memberId}`, "update-chat", dataObj);
    } catch (error) {
      console.log(error);
    }
  });
  res.json({ newMessage: newMessage, error: false });
};
// const getMessage = async (req, res, next) => {
//   try {
//     res.json({
//       chat: chat,
//       error: false,
//     });
//   } catch (error) {
//     res.json({ message: "Error finding chat", error: true });
//   }
// }

exports.addMessage = addMessage;
// exports.getChat = getChat;
