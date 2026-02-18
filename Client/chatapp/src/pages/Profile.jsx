import { useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "../Components/ui/avatar";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Sarah");
  const [lastName, setLastName] = useState("Chen");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to chats
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/20">
          <h1 className="text-center text-xl font-semibold text-foreground">Edit Profile</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Update your personal information
          </p>

          {/* Avatar */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-semibold text-white">
                  SC
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-white transition-transform hover:scale-110">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <button className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
              Upload new photo
            </button>
          </div>

          {/* Form */}
          <div className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">First Name</label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input
                value="sarah.chen@convox.io"
                disabled
                className="rounded-xl border-border bg-muted/30 text-muted-foreground"
              />
            </div>

            <Button className="mt-2 w-full rounded-xl bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] py-5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[hsl(228,76%,55%)]/25 border-0">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
