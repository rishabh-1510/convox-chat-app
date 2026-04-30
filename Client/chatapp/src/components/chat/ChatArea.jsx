import { useRef, useEffect, useState } from "react";
import { Phone, Video, MoreVertical, Smile, Paperclip, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import api from "../../services/api";
import { getSocket } from "../../services/socket";
import { useSelector } from "react-redux";

export function ChatArea({ selectedChat, messages, setMessages }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  /* ================= SOCKET SETUP ================= */

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;

    socket.emit("setup", user);
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedChat) return;

    socket.emit("join chat", selectedChat._id);
  }, [selectedChat]);

  /* ================= SOCKET LISTENER (FIXED) ================= */

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (newMessage) => {
      if (!selectedChat) return;

      // only for current chat
      if (newMessage.chat._id !== selectedChat._id) return;

      // ignore own messages
      if (newMessage.sender._id === user.id) return;

      setMessages((prev) => {
        // prevent duplicates
        if (prev.some((msg) => msg._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    };

    socket.on("message received", handler);

    return () => socket.off("message received", handler);
  }, [selectedChat, user]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= EMPTY STATE ================= */

  if (!selectedChat) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  /* ================= CHAT HEADER LOGIC ================= */

  let chatName, chatAvatar;

  if (selectedChat.isGroupChat) {
    chatName = selectedChat.chatName;

    chatAvatar = (
      <>
        <AvatarImage src={selectedChat.groupAvatar} />
        <AvatarFallback>
          {selectedChat.chatName?.charAt(0)}
        </AvatarFallback>
      </>
    );
  } else {
    const otherUser = selectedChat.users.find(
      (u) => u._id !== user.id
    );

    chatName = `${otherUser?.firstName} ${otherUser?.lastName}`;

    chatAvatar = (
      <>
        <AvatarImage src={otherUser?.avatar} />
        <AvatarFallback>
          {otherUser?.firstName?.charAt(0)}
        </AvatarFallback>
      </>
    );
  }

  /* ================= SEND MESSAGE ================= */

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageToSend = input;
    setInput("");

    try {
      const res = await api.post("/message", {
        content: messageToSend,
        chatId: selectedChat._id,
      });

      const newMessage = res.data.message;

      // ✅ Optimistic update
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });

      const socket = getSocket();
      if (socket) {
        socket.emit("new message", newMessage);
      }
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="flex h-full flex-1 flex-col bg-background">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {chatAvatar}
          </Avatar>

          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {chatName}
            </h2>

            {selectedChat.isGroupChat && (
              <p className="text-xs text-muted-foreground">
                {selectedChat.users.length} members
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6 py-4">
          <div className="space-y-4">

            {messages.map((msg) => {
              const isOutgoing = msg.sender?._id === user.id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[65%] space-y-1">

                    {/* GROUP: show sender */}
                    {selectedChat.isGroupChat && !isOutgoing && (
                      <p className="text-xs text-muted-foreground">
                        {msg.sender?.firstName}
                      </p>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm ${isOutgoing
                        ? "bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-white"
                        : "bg-secondary text-foreground"
                        }`}
                    >
                      {msg.content}
                    </div>

                    <p
                      className={`text-[10px] text-muted-foreground ${isOutgoing ? "text-right" : "text-left"
                        }`}
                    >
                      {msg.createdAt &&
                        new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* INPUT */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-2.5">

          <Smile className="h-5 w-5 text-muted-foreground" />

          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <Paperclip className="h-5 w-5 text-muted-foreground" />

          <button
            onClick={handleSend}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-white"
          >
            <Send className="h-4 w-4" />
          </button>

        </div>
      </div>
    </div>
  );
}