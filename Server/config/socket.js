const { Server } = require("socket.io");

const configureSocket = (server) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // ================================
    // SETUP USER (JOIN PERSONAL ROOM)
    // ================================
    socket.on("setup", (userData) => {
      if (!userData || !userData.id) {
        console.log("⚠️ Invalid user data in setup:", userData);
        return;
      }

      socket.join(userData.id);
      console.log("User joined personal room:", userData.id);
      socket.emit("connected");
    });


    // ================================
    // JOIN CHAT ROOM
    // ================================
    // socket.on("new message", (newMessage) => {
    //   console.log("📨 New message received on server");
    //   console.log("Chat ID:", newMessage.chat);

    //   const chatId =
    //     typeof newMessage.chat === "object"
    //       ? newMessage.chat._id
    //       : newMessage.chat;

    //   socket.to(chatId).emit("message received", newMessage);
    // });
    // ================================
    // NEW MESSAGE
    // ================================
    socket.on("new message", (newMessage) => {
      const chat = newMessage.chat;

      if (!chat.users) return;

      chat.users.forEach((userId) => {
        // don't send to sender
        if (String(userId) === String(newMessage.sender._id)) return;

        console.log("📤 Sending to user room:", userId);

        socket.to(userId).emit("message received", newMessage);
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
