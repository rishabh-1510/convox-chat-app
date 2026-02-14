const { Server } = require("socket.io");

const configureSocket = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000", // later restrict to frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // ================================
    // SETUP USER (JOIN PERSONAL ROOM)
    // ================================
    socket.on("setup", (userData) => {
      if (!userData || !userData._id) {
        console.log("⚠️ Invalid user data in setup:", userData);
        return;
      }

      socket.join(userData._id);
      console.log("User joined personal room:", userData._id);
      socket.emit("connected");
    });


    // ================================
    // JOIN CHAT ROOM
    // ================================
    socket.on("join chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    // ================================
    // NEW MESSAGE
    // ================================
    socket.on("new message", (newMessage) => {
      const chat = newMessage.chat;

      if (!chat.users) return;

      chat.users.forEach((user) => {
        // don't send message back to sender
        if (user._id === newMessage.sender._id) return;

        socket.to(user._id).emit("message received", newMessage);
      });
    });

    // ================================
    // TYPING INDICATOR
    // ================================
    socket.on("typing", (chatId) => {
      socket.in(chatId).emit("typing");
    });

    socket.on("stop typing", (chatId) => {
      socket.in(chatId).emit("stop typing");
    });

    // ================================
    // DISCONNECT
    // ================================
    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = configureSocket;
