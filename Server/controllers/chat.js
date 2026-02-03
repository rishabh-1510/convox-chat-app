const Chat = require("../models/Chat");
const User = require("../models/User");

// @desc    Create or fetch 1-to-1 chat
// @route   POST /api/chat
// @access  Protected
exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body; // other user's ID
    const loggedInUserId = req.user.id;

    //  Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    //  Check if chat already exists (1-to-1)
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [loggedInUserId, userId] },
    })
      .populate("users", "-password")
      .populate("lastMessage");

    if (chat) {
      return res.status(200).json({
        success: true,
        chat,
      });
    }

    //  If not exists → create new chat
    const newChat = await Chat.create({
      chatName: "personal-chat",
      isGroupChat: false,
      users: [loggedInUserId, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json({
      success: true,
      chat: fullChat,
    });

  } catch (error) {
    console.error("accessChat error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to access chat",
    });
  }
};

exports.fetchChats = async (req, res) => {
  try {
    const userId = req.user.id;

    //  Find all chats where user is a participant
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate("users", "-password")
      .populate("admin", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      chats,
    });

  } catch (error) {
    console.error("fetchChats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

exports.createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body;
    const adminId = req.user.id;

    //  Validate input
    if (!name || !users) {
      return res.status(400).json({
        success: false,
        message: "Group name and users are required",
      });
    }
    // users should be an array (from frontend)
    if (!Array.isArray(users)) {
      return res.status(400).json({
        success: false,
        message: "Users must be an array of user IDs",
      });
    }

    // Minimum 3 users total (including admin)
    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 3 users are required to form a group",
      });
    }

    //  Add admin to users list if not already present
    if (!users.includes(adminId)){
      users.push(adminId);
    }

    //  Create group chat
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users,
      admin: adminId,
    });

    //  Populate response
    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("admin", "-password");

    return res.status(201).json({
      success: true,
      chat: fullGroupChat,
    });

  } catch (error) {
    console.error("createGroupChat error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create group chat",
    });
  }
};

exports.renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!chatId || !chatName) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and new group name are required",
      });
    }

    //  Find chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    //  Ensure it's a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({
        success: false,
        message: "Only group chats can be renamed",
      });
    }

    //  Only admin can rename group
    if (chat.admin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only group admin can rename the group",
      });
    }

    //  Update group name
    chat.chatName = chatName;
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("admin", "-password");

    return res.status(200).json({
      success: true,
      chat: updatedChat,
    });

  } catch (error) {
    console.error("renameGroup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to rename group",
    });
  }
};

const Chat = require("../models/Chat");

// @desc    Add a user to group chat
// @route   PUT /api/chat/add
// @access  Protected
exports.addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const adminId = req.user.id;

    //  Validate input
    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and User ID are required",
      });
    }

    //  Find chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    //  Ensure it's a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({
        success: false,
        message: "Users can only be added to group chats",
      });
    }

    //  Only admin can add users
    if (chat.admin.toString() !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Only group admin can add users",
      });
    }

    //  Prevent duplicate users
    if (chat.users.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already exists in the group",
      });
    }

    //  Add user to group
    chat.users.push(userId);
    await chat.save();

    //  Return updated chat
    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("admin", "-password");

    return res.status(200).json({
      success: true,
      chat: updatedChat,
    });

  } catch (error) {
    console.error("addToGroup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add user to group",
    });
  }
};

// @desc    Remove a user from group chat
// @route   PUT /api/chat/remove
// @access  Protected
exports.removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const requesterId = req.user.id;

    //  Validate input
    if (!chatId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and User ID are required",
      });
    }

    //  Find chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Ensure it's a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({
        success: false,
        message: "Users can only be removed from group chats",
      });
    }

    //  Only admin can remove users (or user can remove himself)
    const isAdmin = chat.admin.toString() === requesterId;
    const isSelfRemove = requesterId === userId;

    if (!isAdmin && !isSelfRemove) {
      return res.status(403).json({
        success: false,
        message: "Only admin can remove other users from group",
      });
    }

    // Prevent removing admin by others
    if (userId === chat.admin.toString() && !isSelfRemove) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot be removed by others",
      });
    }

    //  Remove user from group
    chat.users = chat.users.filter(
      (id) => id.toString() !== userId
    );

    //  If admin leaves → assign new admin
    if (userId === chat.admin.toString()) {
      chat.admin = chat.users[0] || null;
    }

    await chat.save();

    //  Return updated chat
    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("admin", "-password");

    return res.status(200).json({
      success: true,
      chat: updatedChat,
    });

  } catch (error) {
    console.error("removeFromGroup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove user from group",
    });
  }
};
