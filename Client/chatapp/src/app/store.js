import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import messageReducer from "../features/message/messageSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    message: messageReducer,
    user: userReducer,
  },
});
