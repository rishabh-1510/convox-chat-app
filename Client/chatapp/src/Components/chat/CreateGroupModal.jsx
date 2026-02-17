import { useState } from "react";
import { X, Search, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const allUsers = [
  { id: "1", name: "Sarah Chen", avatar: "SC", color: "from-blue-500 to-indigo-600" },
  { id: "2", name: "Marcus Webb", avatar: "MW", color: "from-emerald-500 to-teal-600" },
  { id: "3", name: "Olivia Park", avatar: "OP", color: "from-orange-500 to-rose-600" },
  { id: "4", name: "James Liu", avatar: "JL", color: "from-violet-500 to-purple-600" },
  { id: "5", name: "Emily Torres", avatar: "ET", color: "from-pink-500 to-fuchsia-600" },
  { id: "6", name: "Nina Patel", avatar: "NP", color: "from-cyan-500 to-blue-600" },
];

export function CreateGroupModal({ open, onClose }) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([allUsers[0], allUsers[3]]);

  if (!open) return null;

  const filtered = allUsers.filter(
    (u) =>
      !selected.find((s) => s.id === u.id) &&
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (user) => {
    setSelected((prev) =>
      prev.find((s) => s.id === user.id)
        ? prev.filter((s) => s.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim() || selected.length < 2) return;

    // frontend only
    console.log("Group name:", groupName);
    console.log("Members:", selected);

    // reset
    setGroupName("");
    setSearch("");
    setSelected([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)]">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Create Group</h2>
            <p className="text-xs text-muted-foreground">
              Add members to start chatting
            </p>
          </div>
        </div>

        {/* Group Name */}
        <div className="mt-6 space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Group Name
          </label>
          <Input
            placeholder="e.g. Design Team"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="rounded-xl border-border bg-muted/50"
          />
        </div>

        {/* Search Users */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Add Members
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full bg-transparent text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Selected Users */}
        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary py-1 pl-1 pr-2.5"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${user.color} text-[9px] font-semibold text-white`}
                  >
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>

                <span className="text-xs font-medium">
                  {user.name.split(" ")[0]}
                </span>

                <button
                  onClick={() => toggleUser(user)}
                  className="ml-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* User List */}
        {filtered.length > 0 && (
          <div className="mt-4 max-h-36 space-y-1 overflow-y-auto rounded-xl border border-border/50 bg-muted/30 p-2">
            {filtered.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUser(user)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-secondary"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${user.color} text-[10px] font-semibold text-white`}
                  >
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={!groupName.trim() || selected.length < 2}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] py-5 text-sm font-semibold text-white hover:scale-[1.02] border-0 disabled:opacity-40"
        >
          Create Group ({selected.length} members)
        </Button>
      </div>
    </div>
  );
}
