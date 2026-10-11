import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { BottomNav, type TabId } from '@/components/BottomNav';
import { NotificationsModal, SearchModal } from '@/components/Modals';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MoneyScreen } from '@/screens/MoneyScreen';
import { InvestScreen } from '@/screens/InvestScreen';
import { PortfolioScreen } from '@/screens/PortfolioScreen';
import { GoalsScreen } from '@/screens/GoalsScreen';
import { AIScreen } from '@/screens/AIScreen';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { hasOnboarded } = useApp();
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 size={32} className="text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!hasOnboarded) {
    return <OnboardingScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header
        onSearchClick={() => setShowSearch(true)}
        onNotificationsClick={() => setShowNotifications(true)}
        onSignOut={signOut}
        userEmail={user.email}
      />
      <main className="max-w-md mx-auto pb-20">
        {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
        {activeTab === 'money' && <MoneyScreen />}
        {activeTab === 'invest' && <InvestScreen />}
        {activeTab === 'portfolio' && <PortfolioScreen />}
        {activeTab === 'goals' && <GoalsScreen />}
        {activeTab === 'ai' && <AIScreen />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
