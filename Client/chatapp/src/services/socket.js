import { io } from "socket.io-client";

let socket = null;

// 🔌 Connect Socket
export const connectSocket = (user) => {
  if (!user) return;

  if (socket) return socket; // prevent multiple connections

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  // Send user data to backend
  socket.emit("setup", user);

  return socket;
};

// 📡 Get existing socket
export const getSocket = () => {
  return socket;
};

// ❌ Disconnect manually (for logout)
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
