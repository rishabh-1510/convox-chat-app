import { use, useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../Components/ui/avatar";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import api from "../services/api";
import { toast } from "sonner";
import { setCredentials, setLoading ,updateUser} from "../redux/slices/authSlice";

const Profile = () => {
  const { loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log('user is ', user)
  const SaveChangesHandler = async () => {
    try {
      dispatch(setLoading(true));

      const formData = new FormData();

      formData.append("firstName", input.firstName);
      formData.append("lastName", input.lastName);

      if (input.avatar) {
        formData.append("avatar", input.avatar);
      }

      console.log("sending:", formData);

      const update = await api.put("/user/update", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (update.data.success) {
        toast.success("Profile Updated Successfully");

        // update redux user also
        dispatch(updateUser(update.data.user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const [input, setInput] = useState({
    avatar: "",
    avatarPreview: user?.avatar || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const changeEventhandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };
  const avatarChangeHandler = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB");
      return;
    }

    const preview = URL.createObjectURL(file);

    setInput({
      ...input,
      avatar: file,
      avatarPreview: preview
    });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/chat")}
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
              <Avatar className="h-24 w-24" >
                <input
                  type="file"
                  accept="image/*"
                  onChange={avatarChangeHandler}
                  className="hidden"
                  id="avatarUpload"
                />
                <AvatarImage src={input?.avatarPreview} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-semibold text-white" >
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => document.getElementById("avatarUpload").click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] text-white"
              >
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
                  value={input?.firstName}
                  name='firstName'
                  onChange={changeEventhandler}
                  className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                <Input
                  value={input?.lastName}
                  name="lastName"
                  onChange={changeEventhandler}
                  className="rounded-xl border-border bg-muted/50 text-foreground focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input
                value={user?.email}
                disabled
                className="rounded-xl border-border bg-muted/30 text-muted-foreground"
              />
            </div>
            {
              loading ? (<div>
                <div className="flex justify-center items-center mt-2 py-5">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              </div>) : (<Button className="mt-2 w-full rounded-xl bg-gradient-to-r from-[hsl(228,76%,55%)] to-[hsl(252,70%,50%)] py-5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[hsl(228,76%,55%)]/25 border-0" onClick={SaveChangesHandler}>
                Save Changes
              </Button>)
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
