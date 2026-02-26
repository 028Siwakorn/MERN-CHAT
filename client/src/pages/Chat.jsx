import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useSocket, getSocket } from "../hooks/useSocket";
import { useChatStore } from "../store/useChatStore";
import { api } from "../lib/utils";

export default function Chat() {
  const { user, loading } = useAuth();
  useSocket();
  const { onlineUsers, selectedChat, setSelectedChat, messages, addMessage } =
    useChatStore((s) => ({
      onlineUsers: s.onlineUsers,
      selectedChat: s.selectedChat,
      setSelectedChat: s.setSelectedChat,
      messages: s.messages,
      addMessage: s.addMessage,
    }));

  const [friends, setFriends] = useState([]);
  const [isFriend, setIsFriend] = useState(true);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => scrollToBottom(), [selectedChat, messages]);

  async function fetchFriends() {
    try {
      const res = await api.get("/user/friends");
      setFriends(res.data?.friends || []);
    } catch (err) {
      setFriends([]);
    }
  }

  async function handleSelect(friend) {
    setSelectedChat(friend);
    // check friendship (defensive) - server offers endpoint
    try {
      const res = await api.get(`/user/friends/check/${friend._id}`);
      setIsFriend(Boolean(res.data?.isFriend ?? true));
    } catch (err) {
      setIsFriend(true);
    }
  }

  function scrollToBottom() {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function handleSend(e) {
    e?.preventDefault?.();
    if (!text.trim() || !selectedChat) return;
    const msg = {
      _id: Date.now().toString(),
      text: text.trim(),
      sender: user?._id,
      recipient: selectedChat._id,
      createdAt: new Date().toISOString(),
    };
    addMessage(selectedChat._id, msg);
    setText("");
    const sock = getSocket();
    try {
      sock?.emit?.("message:send", msg);
    } catch (err) {
      // ignore socket errors
    }
  }

  const selectedMessages = selectedChat ? messages[selectedChat._id] || [] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        <aside className="w-72 sm:w-80 border-r border-base-300 flex flex-col bg-base-100 shrink-0">
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center gap-2 font-bold text-neutral-content mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Contacts</span>
            </div>
            <span className="text-sm text-base-content/50">
              ({friends.length} friends)
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            {friends.length === 0 ? (
              <div className="p-4 text-sm text-base-content/60">
                You have no friends yet.
              </div>
            ) : (
              friends.map((f) => (
                <button
                  key={f._id}
                  onClick={() => handleSelect(f)}
                  className={`w-full text-left flex items-center gap-3 p-3 hover:bg-base-200 ${selectedChat?._id === f._id ? "bg-base-200" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold text-base-content/90">
                    {f.name?.slice(0, 1) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base-content truncate">
                      {f.name || f.email}
                    </div>
                    <div className="text-xs text-base-content/50">
                      {onlineUsers?.includes(f._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex flex-col bg-base-100">
            <div className="flex-1 p-4 sm:p-6 overflow-auto">
              {!selectedChat ? (
                <div className="text-center mt-12">
                  <h2 className="text-xl font-bold text-neutral-content mb-2">
                    Select a conversation
                  </h2>
                  <p className="text-sm text-base-content/60">
                    Choose a friend from the left to start chatting.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="mb-4 border-b pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold text-base-content/90">
                        {selectedChat.name?.slice(0, 1) || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-base-content">
                          {selectedChat.name || selectedChat.email}
                        </div>
                        <div className="text-xs text-base-content/50">
                          {onlineUsers?.includes(selectedChat._id)
                            ? "Online"
                            : "Offline"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-ghost btn-sm">X</button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto mb-4">
                    <div className="space-y-3">
                      {selectedMessages.length === 0 ? (
                        <div className="text-center text-sm text-base-content/50 mt-6">
                          No messages yet.
                        </div>
                      ) : (
                        selectedMessages.map((m) => (
                          <div
                            key={m._id}
                            className={`flex ${m.sender === user?._id ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`${m.sender === user?._id ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"} rounded-lg px-3 py-2 max-w-[70%]`}
                            >
                              {m.text}
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  <div>
                    {!isFriend && (
                      <div className="text-center text-sm text-error mb-3">
                        You must be friends with this user to send messages.{" "}
                        <button className="btn btn-xs ml-2">Add Friend</button>
                      </div>
                    )}
                    <form
                      onSubmit={handleSend}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="input input-bordered flex-1"
                        disabled={!selectedChat || !isFriend}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!selectedChat || !isFriend}
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
