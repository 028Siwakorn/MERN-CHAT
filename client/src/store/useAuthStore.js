import { create } from "zustand";
import { api } from "../services/api";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  isCheckingAuth: false,
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const response = await api.get("user/check");
      set({ authUser: response.data });
      console.log(response.data)
      get().connectSocket();
    } catch (error) {
      console.log("Error in CheckAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  register: async (data) => {
    set({ isRegistering: true });
    try {
      const response = await api.post("user/register", data);
      set({ authUser: response.data });
      get().connectSocket();
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response.data.message || "Register failed");
    } finally {
      set({ isRegistering: false });
    }
  },
  logIn: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await api.post("user/login", data);
      set({ authUser: response.data });
      get().connectSocket();
      toast.success("Logged in successfully!");
    } catch (error) {
      console.log(error.response.data)
      toast.error(error.response.data.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logOut: async () => {
    try {
      const response = await api.post("user/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Logout failed");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await api.put("user/update-profile", data);
      set({ authUser: response.data });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Update profile failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;
    const socketURL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5173";
    const newSocket = io(socketURL, {
      query: { userId: authUser._id },
    });
    newSocket.connect();
    set({ socket: newSocket });
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
    }
  },
}));
