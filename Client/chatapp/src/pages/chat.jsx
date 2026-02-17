import { useState } from "react";
import { ChatSiderbar } from "../Components/chat/ChatSiderbar";
import { ChatArea } from "../Components/chat/ChatArea";

const Chat = () => {
  const [activeContactId, setActiveContactId] = useState("1");

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ChatSiderbar
        activeContactId={activeContactId}
        onSelectContact={setActiveContactId}
      />

      <ChatArea activeContactId={activeContactId} />
    </div>
  );
};

export default Chat;
