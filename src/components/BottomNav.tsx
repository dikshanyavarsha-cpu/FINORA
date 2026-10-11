import { Home, Wallet, TrendingUp, Briefcase, Target, Sparkles } from 'lucide-react';

export type TabId = 'home' | 'money' | 'invest' | 'portfolio' | 'goals' | 'ai';

interface NavItem {
  id: TabId;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'money', label: 'Money', icon: Wallet },
  { id: 'invest', label: 'Invest', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'ai', label: 'AI', icon: Sparkles },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 glass border-t border-slate-200 dark:border-slate-700/50 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.id === 'ai' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
