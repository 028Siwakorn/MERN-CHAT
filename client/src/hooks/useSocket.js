import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { useChatStore } from "../store/useChatStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

let socket = null;

export function useSocket() {
  const { user } = useAuth();
  const setOnlineUsers = useChatStore((s) => s.setOnlineUsers);
  const addMessage = useChatStore((s) => s.addMessage);

  useEffect(() => {
    if (!user) return;

    const url = SOCKET_URL || window.location.origin;
    socket = io(url, {
      autoConnect: true,
      withCredentials: true,
    });

    socket.on("connect", () => {
      socket.emit("user:online", { userId: user._id });
    });

    socket.on("users:online", (userIds) => {
      setOnlineUsers(userIds || []);
    });

    // Incoming message from server
    socket.on("message:receive", (msg) => {
      try {
        if (!msg) return;
        // determine chat id (other participant)
        const chatId = msg.sender === user._id ? msg.recipient : msg.sender;
        addMessage(chatId, msg);
      } catch (err) {
        // ignore
      }
    });

    return () => {
      try {
        socket.disconnect();
      } catch (err) { }
      socket = null;
    };
  }, [user, setOnlineUsers, addMessage]);
}

export function getSocket() {
  return socket;
}
