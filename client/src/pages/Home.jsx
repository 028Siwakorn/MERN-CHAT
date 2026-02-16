import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChatStore } from '../stores/useChatStore';
import { useSocket } from '../hooks/useSocket';
import Layout from '../components/Layout';
import ChatBubbleIcon from '../components/ChatBubbleIcon';

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { onlineUsers } = useChatStore();
  useSocket();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const onlineCount = Array.isArray(onlineUsers) ? onlineUsers.length : 0;

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
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`
            w-72 sm:w-80 border-r border-base-300 flex flex-col bg-base-100 shrink-0
            fixed md:relative inset-y-0 left-0 z-50 md:z-auto
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          style={{ top: '56px' }}
        >
          <div className="p-4 border-b border-base-300">
            <div className="flex items-center gap-2 font-bold text-neutral-content mb-4">
              <GroupIcon />
              <span>Contacts</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="toggle toggle-primary toggle-sm" />
              <span className="text-sm text-base-content/70">Show online only</span>
            </label>
            <span className="text-sm text-base-content/50 ml-10">({onlineCount} online)</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
            <p className="text-base-content/50">{onlineCount > 0 ? `${onlineCount} user(s) online` : 'No online users'}</p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile: toggle sidebar button */}
          <div className="md:hidden p-2 border-b border-base-300">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-sm gap-2 text-base-content/70"
              aria-label="Open contacts"
            >
              <GroupIcon />
              <span>Contacts</span>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-base-100 overflow-auto">
            <div className="text-center">
              <ChatBubbleIcon size="lg" className="mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-content mb-2">Welcome to SE Chat!</h2>
              <p className="text-sm sm:text-base text-base-content/60">
                Select a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        </main>
      </div>

    </Layout>
  );
}

function GroupIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

