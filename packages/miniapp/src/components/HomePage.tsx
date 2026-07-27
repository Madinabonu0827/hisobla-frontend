'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import { useDashboard } from '@/hooks/useApi';
import { formatCurrency, formatCompact, getCategoryIcon, formatDate, getCategoryColor } from '@/lib/utils';
import { Plus, Wallet, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles, RefreshCw, TrendingUp } from 'lucide-react';
import apiClient from '@/lib/api';

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export function HomePage() {
  const { telegramId, tgUser, setActiveTab, setShowAddModal, setAddModalType } = useStore();
  const { data: dashboard, loading, refetch } = useDashboard(telegramId);
  const [aiTip, setAiTip] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchTip = useCallback(async () => {
    if (!telegramId) return;
    try {
      const res = await apiClient.post('/ai/advice', { telegramId });
      if (res.success) setAiTip(res.data.summary);
    } catch {}
  }, [telegramId]);

  useEffect(() => { fetchTip(); }, [fetchTip]);

  const d = dashboard || {
    balance: 0, totalIncome: 0, totalExpense: 0, savings: 0, savingsRate: 0,
    recentTransactions: [], budgetProgress: [],
  };

  const savingsRate = d.totalIncome > 0
    ? Math.round(((d.totalIncome - d.totalExpense) / d.totalIncome) * 100)
    : 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    await refetch();
    setRefreshing(false);
  };

  if (loading && !dashboard) {
    return (
      <div className="px-4 pt-6 space-y-4">
        <div className="h-10 w-48 shimmer rounded-xl" />
        <div className="h-40 shimmer rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <div key={i} className="h-16 shimmer rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="px-4 pt-6 pb-4">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold">Assalomu alaykum</h1>
          <p className="text-sm text-gray-400 mt-0.5">{tgUser?.first_name || 'Foydalanuvchi'}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center active:bg-white/10 transition-colors"
        >
          <RefreshCw size={16} className={`text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl p-5 mb-5 shadow-glow-green"
        style={{ background: 'linear-gradient(135deg, rgba(0,214,143,0.15) 0%, rgba(78,205,196,0.08) 50%, rgba(0,180,216,0.05) 100%)', border: '1px solid rgba(0,214,143,0.12)' }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#00d68f]/5" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#4ecdc4]/5" />

        <div className="text-xs text-gray-400 mb-1 tracking-wide uppercase">Joriy balans</div>
        <div className="text-4xl font-bold gradient-text text-glow leading-tight mb-5">
          {formatCurrency(d.balance)}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#00d68f]/8 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-[#00d68f]/20 flex items-center justify-center">
                <ArrowUpRight size={12} className="text-[#00d68f]" />
              </div>
              <span className="text-[10px] text-gray-400">Daromad</span>
            </div>
            <div className="text-sm font-bold text-[#00d68f]">{formatCompact(d.totalIncome)}</div>
          </div>
          <div className="bg-[#ff6b6b]/8 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-[#ff6b6b]/20 flex items-center justify-center">
                <ArrowDownRight size={12} className="text-[#ff6b6b]" />
              </div>
              <span className="text-[10px] text-gray-400">Xarajat</span>
            </div>
            <div className="text-sm font-bold text-[#ff6b6b]">{formatCompact(d.totalExpense)}</div>
          </div>
          <div className="bg-[#a855f7]/8 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1.5">
              <div className="w-5 h-5 rounded-full bg-[#a855f7]/20 flex items-center justify-center">
                <TrendingUp size={12} className="text-[#a855f7]" />
              </div>
              <span className="text-[10px] text-gray-400">Tejamkorlik</span>
            </div>
            <div className="text-sm font-bold text-[#a855f7]">{savingsRate}%</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-5">
        <button
          onClick={() => { setAddModalType('expense'); setShowAddModal(true); }}
          className="glass-card p-3.5 flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff6b6b]/20 to-[#ffa500]/10 flex items-center justify-center">
            <Plus size={22} className="text-[#ff6b6b]" />
          </div>
          <span className="text-[11px] font-medium text-gray-300">Xarajat</span>
        </button>
        <button
          onClick={() => { setAddModalType('income'); setShowAddModal(true); }}
          className="glass-card p-3.5 flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00d68f]/20 to-[#00b4d8]/10 flex items-center justify-center">
            <Wallet size={22} className="text-[#00d68f]" />
          </div>
          <span className="text-[11px] font-medium text-gray-300">Daromad</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className="glass-card p-3.5 flex flex-col items-center gap-2 active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4ecdc4]/20 to-[#3b82f6]/10 flex items-center justify-center">
            <BarChart3 size={22} className="text-[#4ecdc4]" />
          </div>
          <span className="text-[11px] font-medium text-gray-300">Grafik</span>
        </button>
      </motion.div>

      {/* AI Tip */}
      {aiTip && (
        <motion.div
          variants={fadeUp}
          className="glass-card p-4 mb-5 gradient-border cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => setActiveTab('ai')}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#a855f7]/20 flex items-center justify-center">
              <Sparkles size={14} className="text-[#a855f7]" />
            </div>
            <span className="text-xs font-semibold text-[#a855f7]">AI Maslahat</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{aiTip}</p>
        </motion.div>
      )}

      {/* Budget Progress */}
      {d.budgetProgress && d.budgetProgress.length > 0 && (
        <motion.div variants={fadeUp} className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300">Byudjet holati</h3>
            <button onClick={() => setActiveTab('budget')} className="text-xs text-[#4ecdc4] font-medium">
              Batafsil
            </button>
          </div>
          <div className="space-y-2">
            {d.budgetProgress.slice(0, 3).map((b: any, i: number) => {
              const pct = b.monthlyLimit > 0 ? Math.min(100, ((b.spent || 0) / b.monthlyLimit) * 100) : 0;
              const color = pct > 90 ? '#ff6b6b' : pct > 70 ? '#f59e0b' : '#00d68f';
              return (
                <div key={i} className="glass-card p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getCategoryIcon(b.category)}</span>
                      <span className="text-sm text-gray-200 capitalize">{b.category}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ color }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Oxirgi tranzaksiyalar</h3>
          <button onClick={() => setActiveTab('transactions')} className="text-xs text-[#4ecdc4] font-medium">
            Hammasi
          </button>
        </div>

        {d.recentTransactions && d.recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {d.recentTransactions.slice(0, 5).map((t: any, i: number) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="glass-card p-3 flex items-center gap-3 active:scale-[0.98] transition-transform"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${getCategoryColor(t.category)}15` }}
                >
                  {getCategoryIcon(t.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-100 truncate">
                    {t.description || t.category}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{formatDate(t.date)}</div>
                </div>
                <div className={`text-sm font-bold ${t.type === 'INCOME' ? 'text-[#00d68f]' : 'text-[#ff6b6b]'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}{formatCompact(t.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-sm text-gray-400 mb-1">Hali tranzaksiya yo'q</p>
            <button
              onClick={() => { setAddModalType('expense'); setShowAddModal(true); }}
              className="mt-3 px-5 py-2 rounded-xl bg-[#00d68f]/15 text-[#00d68f] text-xs font-semibold active:scale-95 transition-transform"
            >
              Birinchi tranzaksiyani qo'shish
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}