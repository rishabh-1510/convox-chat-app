import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { CreateGroupModal } from "./CreateGroupModal";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { disconnectSocket } from "../../services/socket";
import { toast } from "sonner";
import LogoutModal from "./LogoutModal";


// demo contacts (frontend only)
const contacts = [
    {
        id: "1",
        name: "Sarah Chen",
        avatar: "SC",
        online: true,
        lastMessage: "Let’s finalize UI today",
        timestamp: "10:24 AM",
        unread: 2,
    },
    {
        id: "2",
        name: "Marcus Webb",
        avatar: "MW",
        online: false,
        lastMessage: "API deployed",
        timestamp: "09:10 AM",
        unread: 0,
    },
    {
        id: "3",
        name: "Olivia Park",
        avatar: "OP",
        online: true,
        lastMessage: "Check Figma file",
        timestamp: "Yesterday",
        unread: 4,
    },
];

const avatarColors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-rose-600",
    "from-violet-500 to-purple-600",
    "from-pink-500 to-fuchsia-600",
    "from-cyan-500 to-blue-600",
    "from-amber-500 to-orange-600",
];

export function ChatSiderbar({ activeContactId, onSelectContact }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    
    const [search, setSearch] = useState("");
    const [showGroupModal, setShowGroupModal] = useState(false);

    const filtered = contacts.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-full w-80 flex-col border-r border-border bg-card">
            {/* Logo */}
            <div className="flex items-center justify-between px-5 py-5">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)]">
                        <span className="text-sm font-bold text-white">C</span>
                    </div>
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

            {/* Search */}
            <div className="px-4 pb-3">
                <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
                    />
                </div>
            </div>

            {/* Contact List */}
            <ScrollArea className="flex-1">
                <div className="space-y-0.5 px-2">
                    {filtered.map((contact, i) => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            colorClass={avatarColors[i % avatarColors.length]}
                            isActive={contact.id === activeContactId}
                            onClick={() => onSelectContact(contact.id)}
                        />
                    ))}
                </div>
            </ScrollArea>
            {/* Logout Section */}
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
