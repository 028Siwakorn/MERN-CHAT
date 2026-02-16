import { useTheme } from '../contexts/ThemeContext';
import Layout from '../components/Layout';

const THEMES = [
  'sechat', 'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro',
  'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel',
  'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business',
  'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset',
];

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        {/* Theme section */}
        <section className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-1">Theme</h1>
          <p className="text-base-content/70 mb-6">Choose a theme for your chat interface</p>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  theme === t
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100'
                    : 'hover:bg-base-200'
                }`}
                title={t}
              >
                <ThemeSwatch themeName={t} />
                <span className="text-xs truncate w-full text-center capitalize">{t}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Preview section */}
        <section>
          <h2 className="text-xl font-bold text-base-content mb-4">Preview</h2>
          <div className="rounded-xl border border-base-300 bg-base-200/50 p-4 sm:p-6 max-w-md">
            <div className="flex flex-col gap-4">
              {/* User row */}
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                    <span className="text-sm">J</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-base-content">John Doe</p>
                  <p className="text-xs text-base-content/60">Online</p>
                </div>
              </div>

              {/* Incoming message */}
              <div className="chat chat-start">
                <div className="chat-bubble bg-base-300 text-base-content">
                  Hey! How's it going?
                  <div className="chat-footer opacity-70 text-xs">12:00 PM</div>
                </div>
              </div>

              {/* Outgoing message */}
              <div className="chat chat-end">
                <div className="chat-bubble bg-primary text-primary-content">
                  I'm doing great! Just working on some new features.
                  <div className="chat-footer opacity-70 text-xs">12:00 PM</div>
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="This is a preview"
                  className="input input-bordered flex-1 bg-base-100"
                  readOnly
                />
                <button type="button" className="btn btn-primary btn-square" aria-label="Send">
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function ThemeSwatch({ themeName }) {
  return (
    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex shrink-0"
      data-theme={themeName}
    >
      <div className="w-full h-full flex">
        <div className="flex-1 bg-primary" />
        <div className="flex-1 bg-secondary" />
        <div className="flex-1 bg-accent" />
        <div className="flex-1 bg-base-100" />
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
