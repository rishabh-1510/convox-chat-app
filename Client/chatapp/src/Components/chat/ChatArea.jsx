import { useRef, useEffect, useState } from "react";
import { Phone, Video, MoreVertical, Smile, Paperclip, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

// dummy data (frontend only)
const contacts = [
  { id: "1", name: "John Doe", avatar: "JD", online: true },
  { id: "2", name: "Sarah Smith", avatar: "SS", online: false },
];

const demoMessages = [
  { id: "m1", text: "Hey, how are you?", isOutgoing: false, timestamp: "10:02 AM" },
  { id: "m2", text: "I'm good, what about you?", isOutgoing: true, timestamp: "10:03 AM" },
];
 
export function ChatArea({ activeContactId }) {
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const contact = contacts.find((c) => c.id === activeContactId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContactId]);

  if (!contact) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      isOutgoing: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
              {contact.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{contact.name}</h2>
            {contact.online && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-400">Online</span>
              </div>
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

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOutgoing ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[65%] space-y-1">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.isOutgoing
                      ? "rounded-br-md bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-white"
                      : "rounded-bl-md bg-secondary text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
                <p
                  className={`text-[10px] text-muted-foreground ${
                    msg.isOutgoing ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

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
