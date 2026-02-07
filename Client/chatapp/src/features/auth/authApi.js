import api from "../../services/api";

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const signupUser = (data) =>
  api.post("/auth/signup", data);

export const sendOtp = (email) =>
  api.post("/auth/send-otp", { email });
