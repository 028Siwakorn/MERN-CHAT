import { create } from "zustand";

export const useChatStore = create((set, get) => ({
    onlineUsers: [],
    selectedChat: null,
    messages: {},

    setOnlineUsers: (userIds) => set({ onlineUsers: userIds }),

    setSelectedChat: (chat) => set({ selectedChat: chat }),

    addMessage: (chatId, message) => {
        set((state) => {
            const chatMessages = state.messages[chatId] || [];
            // avoid duplicate messages by ID
            if (chatMessages.some((m) => m._id === message._id)) {
                return state;
            }
            return {
                messages: {
                    ...state.messages,
                    [chatId]: [...chatMessages, message],
                },
            };
        });
    },

    setMessages: (chatId, newMessages) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [chatId]: newMessages,
            }
        }));
    }
}));
