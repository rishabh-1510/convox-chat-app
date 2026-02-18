import { useRef, useEffect, useState } from "react";
import { Phone, Video, MoreVertical, Smile, Paperclip, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import api from "../../services/api";
import { getSocket } from "../../services/socket";
import { useSelector } from "react-redux";

export function ChatArea({ selectedChat, messages, setMessages }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const socket = getSocket();

  // Scroll to bottom when new message comes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  Listen for real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessage) => {
      if (selectedChat && newMessage.chat._id === selectedChat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket.off("message received");
  }, [socket, selectedChat]);

  if (!selectedChat) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a chat to start messaging
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await api.post("/message", {
        content: input,
        chatId: selectedChat._id,
      });

      setMessages((prev) => [...prev, res.data]);
      socket.emit("new message", res.data);
      setInput("");
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
              {selectedChat.chatName?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {selectedChat.chatName}
            </h2>
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

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isOutgoing = msg.sender._id === user._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[65%] space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isOutgoing
                        ? "rounded-br-md bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-white"
                        : "rounded-bl-md bg-secondary text-foreground"
                      }`}
                  >
                    {msg.content}
                  </div>
                  <p
                    className={`text-[10px] text-muted-foreground ${isOutgoing ? "text-right" : "text-left"
                      }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
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

      {/* Input Bar */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-2.5">
          <button className="text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button className="text-muted-foreground hover:text-foreground">
            <Paperclip className="h-5 w-5" />
          </button>

          <button
            onClick={handleSend}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-white transition-transform hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
