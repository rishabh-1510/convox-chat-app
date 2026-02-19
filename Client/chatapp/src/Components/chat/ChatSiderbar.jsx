import { useEffect, useState } from "react";
import { Search, Plus, LogOut } from "lucide-react";
import { CreateGroupModal } from "./CreateGroupModal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import api from "../../services/api";
import { toast } from "sonner";

const avatarColors = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-pink-500 to-fuchsia-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
];

export function ChatSiderbar({ selectedChat, setSelectedChat }) {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("chats are", chats)
  // 🔹 Fetch existing chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chat");
        console.log("res is", res);
        setChats(res.data.chats);

      } catch (err) {
        console.log(err);
      }
    };

    fetchChats();
  }, []);

  // 🔹 Search registered users
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        const res = await api.get(`/user/search?query=${search}`);
        setSearchResults(res.data.users);
        console.log(res)
      } catch (err) {
        console.log(err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // 🔹 Start new conversation
  const startConversation = async (userObj) => {
    try {
      const res = await api.post("/chat/start", { userId: userObj._id });
      const chat = res.data.chat;

      setSelectedChat(chat);

      setChats((prev) => {
        const filtered = prev.filter((c) => c._id !== chat._id);
        return [chat, ...filtered];
      });

      setSearch("");
      setSearchResults([]);
    } catch (err) {
      toast.error("Failed to start conversation");
    }
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-card">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-5">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <Avatar>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.fullname?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <span className="text-lg font-semibold tracking-tight text-foreground">
            ConvoX
          </span>
        </div>

        <button
          onClick={() => setShowGroupModal(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* SEARCH */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* LIST */}
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 px-2">

          {/* 🔎 SEARCH MODE */}
          {search.trim() !== "" ? (
            searchResults.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              searchResults.map((u, i) => (

                <ContactItem
                  key={u._id}
                  contact={{
                    _id: u._id,
                    name: u.firstName + ' ' + u.lastName,
                    avatar: <img src={`${u.avatar}`} />,
                    online: false,
                    lastMessage: "Start conversation",
                    timestamp: "",
                    unread: 0,
                  }}
                  colorClass={avatarColors[i % avatarColors.length]}
                  isActive={u._id === selectedChat?._id}
                  onClick={() => startConversation(u)}
                />
              ))

            )
          ) : (
            /* 💬 CHAT MODE */
            chats.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              chats.map((chat, i) => {
                const otherUser = chat.users.find(
                  (u) => u._id !== user.id   // IMPORTANT: use user.id (not _id)
                );

                return (
                  <ContactItem
                    key={chat._id}
                    contact={{
                      _id: chat._id,
                      name: otherUser?.firstName,
                      avatar: <img src={`${otherUser?.avatar}`}/>,
                      online: false,
                      lastMessage: chat.latestMessage?.content || "",
                      unread: 0,
                    }}
                    colorClass={avatarColors[i % avatarColors.length]}
                    isActive={chat._id === selectedChat?._id}
                    onClick={() => setSelectedChat(chat)}
                  />
                );
              })

            )
          )}
        </div>
      </ScrollArea>

      {/* LOGOUT */}
      <div className="border-t border-border p-4">
        <button
          onClick={() => setShowLogout(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <CreateGroupModal
        open={showGroupModal}
        onClose={() => setShowGroupModal(false)}
      />

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
      />
    </div>
  );
}

/* CONTACT ITEM */

function ContactItem({ contact, colorClass, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${isActive
        ? "bg-secondary shadow-sm shadow-[hsl(228,76%,60%)]/10"
        : "hover:bg-muted/60"
        }`}
    >
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11">
          <AvatarFallback
            className={`bg-gradient-to-br ${colorClass} text-xs font-semibold text-white`}
          >
            {contact.avatar}
          </AvatarFallback>
        </Avatar>

        {contact.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">
            {contact.name}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
            {contact.timestamp}
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {contact.lastMessage}
        </p>
      </div>

      {contact.unread > 0 && (
        <Badge className="h-5 min-w-[20px] shrink-0 bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] px-1.5 text-[10px] font-bold text-white border-0">
          {contact.unread}
        </Badge>
      )}
    </button>
  );
}
