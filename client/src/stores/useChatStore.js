import { create } from 'zustand';

export const useChatStore = create((set) => ({
  selectedChat: null,
  onlineUsers: [],
  messages: {},
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),
  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: messages,
      },
    })),
  reset: () =>
    set({ selectedChat: null, onlineUsers: [], messages: {} }),
}));
