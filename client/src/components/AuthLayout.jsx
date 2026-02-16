import { Link } from 'react-router-dom';
import ChatBubbleIcon from './ChatBubbleIcon';

export default function AuthLayout({ children, type = 'login' }) {
  const isLogin = type === 'login';

  return (
    <div className="min-h-screen bg-base-100 flex flex-col" data-theme="sechat">
      <header className="navbar bg-base-200 px-4 sm:px-6 py-3 border-b border-base-300">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-neutral-content font-bold">
            <ChatBubbleIcon size="sm" />
            <span>SE Chat</span>
          </Link>
        </div>
        <Link to="/settings" className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors" aria-label="Settings">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-8 xl:p-12 bg-base-200/50 shrink-0">
          <div className="grid grid-cols-3 gap-3 xl:gap-4 mb-6 xl:mb-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-14 h-14 xl:w-20 xl:h-20 rounded-lg bg-base-300" />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-neutral-content mb-2">
            {isLogin ? 'Welcome back!' : 'Join our community'}
          </h2>
          <p className="text-base-content/70 text-center max-w-sm">
            {isLogin
              ? 'Sign in to continue your conversations and catch up with your messages.'
              : 'Connect with friends, share moments, and stay in touch with your loved ones.'}
          </p>
        </div>
      </div>
    </div>
  );
}
