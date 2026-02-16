import { Link, useLocation } from 'react-router-dom';
import ChatBubbleIcon from './ChatBubbleIcon';

export default function Layout({ children, showNav = true }) {
  const location = useLocation();
  const isSettings = location.pathname === '/settings';
  const isProfile = location.pathname === '/profile';

  if (!showNav) return children;

  return (
    <div className="min-h-screen bg-base-100">
      <header className="navbar bg-base-200 px-4 sm:px-6 py-3 border-b border-base-300 flex-wrap gap-2">
        <div className="flex-1 min-w-0">
          <Link to="/" className="flex items-center gap-2 text-neutral-content font-bold truncate">
            <ChatBubbleIcon size="sm" className="shrink-0" />
            <span className="truncate">SE Chat</span>
          </Link>
        </div>
        <div className="flex gap-2 sm:gap-4 shrink-0">
          <Link to="/settings" className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors ${isSettings ? 'bg-base-300/50 text-primary border border-base-300' : 'text-base-content/70 hover:text-primary hover:bg-base-300/50'}`} aria-label="Settings">
            <SettingsIcon />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          <Link to="/profile" className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors ${isProfile ? 'bg-base-300/50 text-primary border border-base-300' : 'text-base-content/70 hover:text-primary hover:bg-base-300/50'}`} aria-label="Profile">
            <ProfileIcon />
            <span className="hidden sm:inline">Profile</span>
          </Link>
          <Link to="/logout" className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg text-base-content/70 hover:text-error hover:bg-base-300/50 transition-colors" aria-label="Logout">
            <LogoutIcon />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
