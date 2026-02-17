import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { disconnectSocket } from "../../services/socket";

const LogoutModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    dispatch(logout());
    disconnectSocket();
    onClose();
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout? You will need to sign in again.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
