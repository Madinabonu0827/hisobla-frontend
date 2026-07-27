'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/stores/useStore';
import { useTelegram } from '@/hooks/useTelegram';
import { BottomNav } from '@/components/layout/BottomNav';
import { HomePage } from '@/components/HomePage';
import { TransactionsPage } from '@/components/TransactionsPage';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { BudgetPage } from '@/components/BudgetPage';
import { AIPage } from '@/components/AIPage';
import { ProfilePage } from '@/components/ProfilePage';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const activeTab = useStore((s) => s.activeTab);
  const setTelegramId = useStore((s) => s.setTelegramId);
  const setTgUser = useStore((s) => s.setTgUser);

  const { isReady, user: tgUser, webApp } = useTelegram();

  useEffect(() => {
    if (!isReady || !tgUser) return;

    const id = String(tgUser.id);
    setTelegramId(id);
    setTgUser(tgUser);

    // Apply Telegram theme colors
    if (webApp) {
      document.body.style.backgroundColor = webApp.backgroundColor || '#0a0a1a';
      const w = webApp as any;
      if (typeof w.setHeaderColor === 'function') w.setHeaderColor('#111127');
      if (typeof w.setBackgroundColor === 'function') w.setBackgroundColor('#0a0a1a');
    }

    // Sync user to backend
    const syncUser = async () => {
      try {
        await apiClient.post('/auth/sync', {
          telegramId: id,
          username: tgUser.username || '',
          firstName: tgUser.first_name || '',
          lastName: tgUser.last_name || '',
        });
      } catch (err) {
        console.error('User sync failed:', err);
      }
    };
    syncUser();
  }, [isReady, tgUser, webApp, setTelegramId, setTgUser]);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [isReady]);

  if (isLoading || !isReady) return <LoadingScreen />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-20 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {activeTab === 'home' && <HomePage />}
            {activeTab === 'transactions' && <TransactionsPage />}
            {activeTab === 'analytics' && <AnalyticsPage />}
            {activeTab === 'budget' && <BudgetPage />}
            {activeTab === 'ai' && <AIPage />}
            {activeTab === 'profile' && <ProfilePage />}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
      <AddTransactionModal />
    </div>
  );
}
