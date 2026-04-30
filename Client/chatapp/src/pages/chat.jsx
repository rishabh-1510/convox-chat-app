import { useState, useEffect } from "react";
import { ChatSiderbar } from "../components_temp/chat/ChatSiderbar";
import { ChatArea } from "../components_temp/chat/ChatArea";
import api from "../services/api";
const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  //Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const res = await api.get(`/message/${selectedChat._id}`);
        console.log("res is",res);
        setMessages(res.data.messages);
      } catch (err) {
        console.log("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSiderbar
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      <ChatArea 
      selectedChat={selectedChat}
        messages={messages}
        setMessages={setMessages} />
    </div>
  );
};

export default Chat;
