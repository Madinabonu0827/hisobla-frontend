'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import { User, Bell, Moon, Globe, Shield, FileText, ChevronRight, Smartphone, HelpCircle, Info } from 'lucide-react';
import apiClient from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export function ProfilePage() {
  const { tgUser, telegramId } = useStore();
  const [stats, setStats] = useState({ transactions: 0, budgets: 0, goals: 0, totalSpent: 0 });

  useEffect(() => {
    if (!telegramId) return;
    const fetchStats = async () => {
      try {
        const [dashRes, budgetRes] = await Promise.all([
          apiClient.get(`/analytics/dashboard/${telegramId}`),
          apiClient.get(`/budgets/${telegramId}?month=${String(new Date().getMonth() + 1).padStart(2, '0')}&year=${new Date().getFullYear()}`),
        ]);
        if (dashRes.success) {
          setStats(prev => ({
            ...prev,
            transactions: dashRes.data.recentTransactions?.length || 0,
            totalSpent: dashRes.data.totalExpense || 0,
          }));
        }
        if (budgetRes.success) {
          setStats(prev => ({ ...prev, budgets: budgetRes.data?.length || 0 }));
        }
      } catch {}
    };
    fetchStats();
  }, [telegramId]);

  const displayName = tgUser?.first_name
    ? tgUser.last_name
      ? `${tgUser.first_name} ${tgUser.last_name}`
      : tgUser.first_name
    : 'Foydalanuvchi';

  const username = tgUser?.username ? `@${tgUser.username}` : '';

  return (
    <div className="px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 mb-6 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00d68f] to-[#4ecdc4] flex items-center justify-center mx-auto mb-4">
          {tgUser?.photo_url ? (
            <img
              src={tgUser.photo_url}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <User size={36} className="text-white" />
          )}
        </div>
        <h2 className="text-lg font-semibold">{displayName}</h2>
        {username && <p className="text-sm text-gray-400">{username}</p>}
        <p className="text-xs text-gray-500 mt-1">ID: {telegramId || '---'}</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-lg font-bold text-[#00d68f]">{stats.transactions}</div>
            <div className="text-[10px] text-gray-500">Tranzaksiya</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#4ecdc4]">{stats.budgets}</div>
            <div className="text-[10px] text-gray-500">Byudjet</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#ff6b6b]">{formatCurrency(stats.totalSpent)}</div>
            <div className="text-[10px] text-gray-500">Jami xarajat</div>
          </div>
        </div>
      </motion.div>

      {/* Settings List */}
      <div className="space-y-2">
        {[
          { icon: Bell, label: 'Bildirishnomalar', desc: 'Push bildirishnomalar', color: '#ff6b6b' },
          { icon: Moon, label: 'Tungi rejim', desc: 'Hozir: Yoqilgan', color: '#a855f7' },
          { icon: Globe, label: 'Til', desc: "O'zbek", color: '#4ecdc4' },
          { icon: Shield, label: 'Xavfsizlik', desc: 'Parol va autentifikatsiya', color: '#00d68f' },
          { icon: FileText, label: 'Hisobotlar', desc: 'PDF, Excel, CSV', color: '#f59e0b' },
          { icon: Smartphone, label: 'Qurilmalar', desc: 'Ulangan qurilmalar', color: '#3b82f6' },
          { icon: HelpCircle, label: 'Yordam', desc: "Savol-javoblar", color: '#ec4899' },
          { icon: Info, label: 'Hisob Bot v1.0.0', desc: 'AI Finance Assistant', color: '#6b7280' },
        ].map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 w-full flex items-center gap-4 hover:bg-white/5 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <item.icon size={20} style={{ color: item.color }} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
