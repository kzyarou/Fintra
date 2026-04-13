import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { HomePage } from './pages/HomePage';
import { AccountsPage } from './pages/AccountsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { FAQPage } from './pages/FAQPage';
import { BottomNav } from './components/BottomNav';
import { SideNav } from './components/SideNav';
import { AddTransactionModal } from './components/AddTransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { AuthPage } from './pages/AuthPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DebtManagerPage } from './pages/DebtManagerPage';
import { DevDashboardPage } from './pages/DevDashboardPage';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ProgressBar } from './components/ProgressBar';
import { HomePageSkeleton } from './components/SkeletonLoader';
import { CallbackPage } from './pages/CallbackPage';
function PageWrapper({ children }: {children: React.ReactNode;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: -10
      }}
      transition={{
        duration: 0.2
      }}
      className="min-h-screen pb-24 lg:pb-0">
      
      {children}
    </motion.div>);

}
function AppContent() {
  const {
    activePage,
    settings,
    isBudgetModalOpen,
    closeBudgetModal,
    selectedBudgetId,
    accounts,
    setActivePage
  } = useFinance();
  const { user, loading, isGuest, isDeveloper } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useLocalStorage(
    'fintra_onboarded',
    false
  );
  useEffect(() => {
    if (window.location.pathname === '/callback') {
      setActivePage('callback' as any);
    }
  }, [setActivePage]);
  // Handle navigation progress bar
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activePage]);
  useEffect(() => {
    const applyTheme = () => {
      if (settings.theme === 'dark') {
        setIsDark(true);
      } else if (settings.theme === 'light') {
        setIsDark(false);
      } else {
        // system
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
      }
    };
    const cleanup = applyTheme();
    return cleanup;
  }, [settings.theme]);
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }
  if (!hasOnboarded) {
    return <Onboarding onComplete={() => setHasOnboarded(true)} />;
  }
  if (loading) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center lg:justify-start">
          <div className="hidden lg:block w-[260px] bg-white dark:bg-[#1C1C1E] border-r border-gray-200 dark:border-[#3A3A3C] shrink-0" />
          <div className="flex-1 max-w-md lg:max-w-none min-h-screen bg-cream dark:bg-[#1C1C1E] relative border-x border-gray-200 dark:border-[#3A3A3C]">
            <HomePageSkeleton />
          </div>
        </div>
      </div>);

  }
  if (!user && !isGuest) {
    return <AuthPage />;
  }
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'accounts':
      case 'cards':
        return <AccountsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'faq':
        return <FAQPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'debts':
        return <DebtManagerPage />;
      case 'callback':
        return <CallbackPage />;
      case 'admin':
        return isDeveloper ? <DevDashboardPage /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };
  return (
    <div className={isDark ? 'dark' : ''}>
      <ProgressBar isNavigating={isNavigating} />
      <div className="min-h-screen bg-gray-100 dark:bg-black flex justify-center lg:justify-start">
        <SideNav onAddClick={() => setIsAddModalOpen(true)} />

        <div className="flex-1 w-full max-w-md lg:max-w-none min-h-screen bg-cream dark:bg-[#1C1C1E] font-sans text-charcoal dark:text-[#F5F5F7] selection:bg-emerald/20 transition-colors relative shadow-2xl overflow-x-hidden border-x border-gray-200 dark:border-[#3A3A3C]">
          <div className="lg:max-w-5xl lg:mx-auto">
            <AnimatePresence mode="wait">
              <PageWrapper key={activePage}>{renderPage()}</PageWrapper>
            </AnimatePresence>
          </div>

          <div className="lg:hidden">
            <BottomNav onAddClick={() => setIsAddModalOpen(true)} />
          </div>

          <AddTransactionModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)} />
          
          <BudgetModal
            isOpen={isBudgetModalOpen}
            onClose={closeBudgetModal}
            initialAccount={accounts.find((a) => a.id === selectedBudgetId)} />
          
          <Toaster position="bottom-center" />
        </div>
      </div>
    </div>);

}
export function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <FinanceProvider>
          <AppContent />
        </FinanceProvider>
      </SubscriptionProvider>
    </AuthProvider>);

}