import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//  Attach token from Redux (NOT directly from localStorage)
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//  Global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired or unauthorized");

      // Clear redux + localStorage
      store.dispatch(logout());

      // Redirect safely
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

