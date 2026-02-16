import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { useChatStore } from '../stores/useChatStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

export function useSocket() {
  const { user } = useAuth();
  const setOnlineUsers = useChatStore((s) => s.setOnlineUsers);

  useEffect(() => {
    if (!user) return;

    const url = SOCKET_URL || window.location.origin;
    const socket = io(url, {
      autoConnect: true,
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('user:online', { userId: user._id });
    });

    socket.on('users:online', (userIds) => {
      setOnlineUsers(userIds || []);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, setOnlineUsers]);
}
