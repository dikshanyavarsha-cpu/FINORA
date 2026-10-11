import { useState, useMemo } from 'react';
import {
  Bell, X, TrendingUp, Target, Wallet, AlertTriangle,
  Sparkles, Check, Search as SearchIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/finance';

interface NotificationsModalProps {
  onClose: () => void;
}

const notifIcons = {
  portfolio: TrendingUp,
  goal: Target,
  sip: Wallet,
  spending: AlertTriangle,
  transaction: Wallet,
  concentration: AlertTriangle,
  health: Sparkles,
  market: TrendingUp,
};

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-4xl sm:rounded-4xl max-h-[80vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-slate-600 dark:text-slate-300" />
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Notifications</h3>
            {unread.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-error-500 text-white text-[10px] font-semibold">{unread.length}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread.length > 0 && (
              <button onClick={markAllNotificationsRead} className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.map((notif) => {
            const Icon = notifIcons[notif.type] || Bell;
            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3 rounded-2xl flex items-start gap-3 cursor-pointer transition-colors ${
                  notif.read ? 'bg-transparent' : 'bg-brand-50 dark:bg-brand-500/10'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.priority === 'high' ? 'bg-error-50 dark:bg-error-500/10' :
                  notif.priority === 'medium' ? 'bg-warning-50 dark:bg-warning-500/10' :
                  'bg-slate-100 dark:bg-slate-700/50'
                }`}>
                  <Icon size={16} className={
                    notif.priority === 'high' ? 'text-error-500' :
                    notif.priority === 'medium' ? 'text-warning-500' :
                    'text-slate-500 dark:text-slate-400'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{notif.title}</p>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(notif.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SearchModalProps {
  onClose: () => void;
}

export function SearchModal({ onClose }: SearchModalProps) {
  const { data } = useApp();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: { type: string; title: string; subtitle: string; value?: string }[] = [];

    data.stocks.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q)) {
        results.push({ type: 'Stock', title: s.name, subtitle: s.symbol, value: formatCurrency(s.quantity * s.currentPrice) });
      }
    });
    data.mutualFunds.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.symbol.toLowerCase().includes(q)) {
        results.push({ type: 'Fund', title: f.name, subtitle: f.category, value: formatCurrency(f.quantity * f.currentNav) });
      }
    });
    data.transactions.forEach((t) => {
      if (t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) {
        results.push({ type: 'Transaction', title: t.description, subtitle: t.category, value: formatCurrency(t.amount) });
      }
    });
    data.goals.forEach((g) => {
      if (g.name.toLowerCase().includes(q)) {
        results.push({ type: 'Goal', title: g.name, subtitle: 'Financial Goal', value: formatCurrency(g.currentAmount) });
      }
    });
    data.bankAccounts.forEach((a) => {
      if (a.bankName.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)) {
        results.push({ type: 'Account', title: a.bankName, subtitle: a.name, value: formatCurrency(a.balance) });
      }
    });

    return results.slice(0, 20);
  }, [query, data]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 animate-fade-in pt-16 px-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl max-h-[70vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <SearchIcon size={18} className="text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stocks, funds, transactions, goals..."
              className="flex-1 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none bg-transparent"
            />
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="text-center py-8">
              <SearchIcon size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Search across your entire financial life</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((r, i) => (
                <div key={i} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-[9px] font-medium text-slate-500 dark:text-slate-400">{r.type}</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{r.title}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{r.subtitle}</p>
                  </div>
                  {r.value && <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{r.value}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
