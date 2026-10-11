import { useState, useRef, useEffect } from 'react';
import { Bell, Moon, Sun, Search, LogOut, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';

interface HeaderProps {
  onSearchClick: () => void;
  onNotificationsClick: () => void;
  onSignOut: () => void;
  userEmail?: string;
}

export function Header({ onSearchClick, onNotificationsClick, onSignOut, userEmail }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 glass border-b border-slate-200 dark:border-slate-700/50">
      <div className="max-w-md mx-auto px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <span className="font-display font-bold text-white text-lg">F</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-slate-900 dark:text-white text-lg leading-none">FINORA</h1>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">AI Financial Co-Pilot</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Search size={20} />
          </button>
          <button
            onClick={onNotificationsClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <User size={18} />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 p-2 animate-scale-in z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/50 mb-1">
                  <p className="text-xs font-medium text-slate-900 dark:text-white">Signed in as</p>
                  <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
