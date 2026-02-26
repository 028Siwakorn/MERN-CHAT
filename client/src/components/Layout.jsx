import { Link, useLocation } from "react-router-dom";
import ChatBubbleIcon from "./ChatBubbleIcon";
import { useAuthStore } from "../store/useAuthStore";
// สมมติว่าใช้ Lucide React สำหรับ User และ LogOut ถ้าไม่ได้ใช้ให้เปลี่ยนเป็น Icon ที่คุณมี
import { User, LogOut } from "lucide-react";

export default function Layout({ children, showNav = true }) {
  const { logOut, authUser } = useAuthStore();
  const location = useLocation();
  const isSettings = location.pathname === "/settings";
  const isProfile = location.pathname === "/profile";

  if (!showNav) return <>{children}</>;

  return (
    <div className="min-h-screen bg-base-100">
      <header className="navbar bg-base-200 px-4 sm:px-6 py-3 border-b border-base-300 flex-wrap gap-2">
        {/* Logo Section */}
        <div className="flex-1 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-neutral-content font-bold truncate"
          >
            <ChatBubbleIcon size="sm" className="shrink-0" />
            <span className="truncate">SE Chat</span>
          </Link>
        </div>

        {/* Actions Section */}
        <div className="flex gap-2 sm:gap-4 shrink-0">
          {/* Settings Link */}
          <Link
            to="/settings"
            className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors ${
              isSettings
                ? "bg-base-300/50 text-primary border border-base-300"
                : "text-base-content/70 hover:text-primary hover:bg-base-300/50"
            }`}
          >
            <SettingsIcon />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {/* Auth-specific Links */}
          {authUser && (
            <>
              <Link
                to="/profile"
                className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors ${
                  isProfile
                    ? "bg-base-300/50 text-primary border border-base-300"
                    : "text-base-content/70 hover:text-primary hover:bg-base-300/50"
                }`}
              >
                <ProfileIcon />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logOut}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg text-base-content/70 hover:text-error hover:bg-base-300/50 transition-colors"
              >
                <LogoutIcon />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

// --- Icons (เหมือนเดิม) ---
function SettingsIcon() {
  /* ... โค้ด SVG ของคุณ ... */
}
function ProfileIcon() {
  /* ... โค้ด SVG ของคุณ ... */
}
function LogoutIcon() {
  /* ... โค้ด SVG ของคุณ ... */
}
