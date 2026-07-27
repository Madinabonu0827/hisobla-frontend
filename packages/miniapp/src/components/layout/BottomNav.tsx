'use client';

import { useStore } from '@/stores/useStore';
import { motion } from 'framer-motion';
import { Home, ArrowLeftRight, BarChart3, Target, Bot, User } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Bosh', icon: Home },
  { id: 'transactions', label: 'Tarix', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Grafik', icon: BarChart3 },
  { id: 'budget', label: 'Byudjet', icon: Target },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'profile', label: 'Profil', icon: User },
];

export function BottomNav() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);

  const handleTab = (id: string) => {
    if (id === activeTab) return;
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
    setActiveTab(id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto px-3 pb-2">
        <nav className="glass rounded-2xl px-1 py-1.5 flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTab(tab.id)}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[44px]"
              >
                <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-[#00d68f]' : 'text-gray-500'
                    }`}
                  />
                </div>
                <span className={`text-[9px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#00d68f]' : 'text-gray-500'
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-[#00d68f]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
