const chatModel = require("../models/chat");
const userModel = require("../models/userModel");
const messageModel = require("../models/message");
const Pusher = require("pusher");
const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECERET,
  cluster: "ap2",
  useTLS: true,
});
const addChat = async (req, res, next) => {
  const { currentUserId, members, isGroup, name } = req.body;
  var query = isGroup
    ? { isGroup, name, members: [currentUserId, ...members] }
    : { members: { $all: [currentUserId, ...members], $size: 2 } };
  try {
    let chat = await chatModel.findOne(query);
    if (!chat) {
      chat = await new chatModel(
        isGroup ? query : { members: [currentUserId, ...members] }
      );
      await chat.save();
      const updateAllMembers = chat.members.map(async (memberId) => {
        await userModel.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      Promise.all(updateAllMembers);
      chat.members.map(async (member) => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }
    res.json({ message: "Created Successfully", chat: chat, error: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding Chat", error: true });
  }
};
const getChat = async (req, res, next) => {
  const { userId } = req.params;
  const { chatId } = req.query;
  if (chatId !== null && chatId !== undefined && chatId !== "") {
    try {
      const chat = await chatModel
        .findById(chatId)
        .populate({
          path: "members",
          select: "fullname email",
          model: userModel,
        })
        .populate({
          path: "messages",
          model: messageModel,
          populate: {
            path: "sender seenBy",
            select: "fullname email",
            model: userModel,
          },
        })
        .exec();
      res.json({
        chat: chat,
        error: false,
      });
    } catch (error) {
      res.json({ message: "Error finding chat", error: true });
    }
  }
  // }
  else {
    try {
      const allChats = await chatModel
        .find({ members: userId })
        .sort({ lastMessage: -1 })
        .populate({
          path: "members",
          select: "fullname email",
          model: userModel,
        })
        .populate({
          path: "messages",
          model: messageModel,
          populate: {
            path: "sender seenBy",
            select: "fullname email",
            model: userModel,
          },
        })
        .exec();
      // const allChatsSt = allChats.map((i) => {
      //   return {
      //     members: i.members.map((inner) => {
      //       return { fullname: inner.fullname, email: inner.email };
      //     }),
      //     messages: i.messages,
      //     isGroup: i.isGroup,
      //     name: i.name,
      //     createdAt: i.createdAt,
      //     lastMessage: i.lastMessage,
      //     _id: i._id,
      //   };
      // });
      allChats.forEach((element) => {
        console.log(element);
      });
      res.json({
        chat: allChats.map((item) => item.toObject({ getters: true })),
        error: false,
      });
    } catch (error) {
      res.json({ message: "Error finding chat", error: true });
    }
  }
};
const seenBy = async (req, res, next) => {
  const { chatId } = req.params;
  const { currentUserId } = req.body;
  try {
    await messageModel
      .updateMany(
        { chat: chatId },
        { $addToSet: { seenBy: currentUserId } },
        { new: true }
      )
      .populate({
        path: "sender seenBy",
        select: "fullname email",
        model: userModel,
      })
      .exec();
    res.json({ message: "seen all messages by user", error: false });
  } catch (error) {
    res.status(500).json({ message: "error occured", error: true });
  }
};
exports.addChat = addChat;
exports.seenBy = seenBy;
exports.getChat = getChat;
