const Message = require("../models/Message");
const Chat = require("../models/Chat");

// @desc    Send a new message
// @route   POST /api/message
// @access  Protected
exports.sendMessage = async (req, res) => {
  try {
    const { content, chatId, type } = req.body;
    const senderId = req.user.id;

    // Validate input
    if (!content || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Message content and chatId are required",
      });
    }

    //  Create message
    let message = await Message.create({
      sender: senderId,
      chat: chatId,
      content,
      type: type || "text",
    });

    //  Populate message (important for frontend)
    message = await message.populate(
      "sender",
      "firstName lastName avatar email"
    );

    message = await message.populate("chat");

    //  Update lastMessage in Chat
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    //  Return response
    return res.status(201).json({
      success: true,
      message,
    });

  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// @desc    Fetch all messages of a chat
// @route   GET /api/message/:chatId
// @access  Protected
exports.fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    //  Validate chatId
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    //  Fetch messages belonging to THIS chat
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "firstName lastName avatar email")
      .populate("chat")
      .sort({ createdAt: 1 }); // oldest → newest

    // Send response
    return res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("fetchMessages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};
