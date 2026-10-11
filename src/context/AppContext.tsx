import { createContext, useContext, useState, type ReactNode } from 'react';
import { demoData } from '@/data/demoData';
import type { DemoData, UserProfile, AIConversation, NotificationItem } from '@/types';

interface AppContextValue {
  data: DemoData;
  isDemoMode: boolean;
  hasOnboarded: boolean;
  setOnboarded: (v: boolean) => void;
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  conversations: AIConversation[];
  addConversation: (c: AIConversation) => void;
  clearConversations: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  aiMemoryEnabled: boolean;
  setAiMemoryEnabled: (v: boolean) => void;
  aiMemory: { key: string; value: string }[];
  addAiMemory: (key: string, value: string) => void;
  removeAiMemory: (key: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(demoData.userProfile);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(demoData.notifications);
  const [aiMemoryEnabled, setAiMemoryEnabled] = useState(true);
  const [aiMemory, setAiMemory] = useState<{ key: string; value: string }[]>([
    { key: 'Primary Goal', value: 'Buy a house in 8 years' },
    { key: 'Risk Preference', value: 'Moderate' },
  ]);

  const addConversation = (c: AIConversation) => {
    setConversations((prev) => [...prev, c]);
  };

  const clearConversations = () => setConversations([]);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addAiMemory = (key: string, value: string) => {
    setAiMemory((prev) => {
      const filtered = prev.filter((m) => m.key !== key);
      return [...filtered, { key, value }];
    });
  };

  const removeAiMemory = (key: string) => {
    setAiMemory((prev) => prev.filter((m) => m.key !== key));
  };

  return (
    <AppContext.Provider
      value={{
        data: demoData,
        isDemoMode: true,
        hasOnboarded,
        setOnboarded: setHasOnboarded,
        userProfile,
        setUserProfile,
        conversations,
        addConversation,
        clearConversations,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        aiMemoryEnabled,
        setAiMemoryEnabled,
        aiMemory,
        addAiMemory,
        removeAiMemory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
