'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, getCategoryIcon, getCategoryColor } from '@/lib/utils';
import { Plus, Trash2, Target, AlertTriangle, TrendingDown } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import apiClient from '@/lib/api';

const BUDGET_CATEGORIES = [
  { id: 'food', name: 'Ovqat', icon: '🍔' },
  { id: 'shopping', name: 'Xarid', icon: '🛍️' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'education', name: 'Ta\'lim', icon: '📚' },
  { id: 'bills', name: 'Kommunal', icon: '🏠' },
  { id: 'entertainment', name: 'Ko\'ngil', icon: '🎮' },
  { id: 'health', name: 'Salomatlik', icon: '🏥' },
  { id: 'clothing', name: 'Kiyim', icon: '👕' },
  { id: 'other_expense', name: 'Boshqa', icon: '📦' },
];

export function BudgetPage() {
  const { telegramId } = useStore();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  useEffect(() => {
    if (telegramId) fetchBudgets();
  }, [telegramId]);

  const fetchBudgets = async () => {
    try {
      const res = await apiClient.get(`/budgets/${telegramId}?month=${month}&year=${year}`);
      if (res.success) setBudgets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCategory || !limit || !telegramId) return;
    try {
      await apiClient.post('/budgets', {
        telegramId,
        category: selectedCategory,
        monthlyLimit: parseInt(limit),
        month,
        year,
      });
      setLimit('');
      setSelectedCategory('');
      setShowAdd(false);
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  const totalBudget = budgets.reduce((s, b) => s + (b.monthlyLimit || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);
  const totalPct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const totalColor = totalPct > 90 ? '#ff6b6b' : totalPct > 70 ? '#f59e0b' : '#00d68f';
  const remaining = Math.max(0, totalBudget - totalSpent);

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Byudjet</h1>
          <p className="text-xs text-gray-400">{now.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-10 h-10 rounded-full bg-[#00d68f]/20 flex items-center justify-center"
        >
          <Plus size={20} className="text-[#00d68f]" />
        </button>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 mb-6"
      >
        <div className="text-center mb-4">
          <div className="text-sm text-gray-400 mb-1">Umumiy byudjet</div>
          <div className="text-3xl font-bold gradient-text">{formatCurrency(totalBudget)}</div>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalPct}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full"
            style={{ background: totalColor }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Sarflangan: <span className="text-[#ff6b6b]">{formatCurrency(totalSpent)}</span></span>
          <span>Qolgan: <span className="text-[#00d68f]">{formatCurrency(remaining)}</span></span>
        </div>
        {totalPct > 90 && (
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-[#ff6b6b]/10 text-xs text-[#ff6b6b]">
            <AlertTriangle size={14} />
            <span>Byudjet deyarli tugadi!</span>
          </div>
        )}
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-3">Yangi byudjet</h3>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {BUDGET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-2 rounded-xl text-center transition-all ${
                      selectedCategory === cat.id
                        ? 'border-2'
                        : 'glass-card border border-transparent'
                    }`}
                    style={selectedCategory === cat.id ? {
                      backgroundColor: `${getCategoryColor(cat.id)}15`,
                      borderColor: getCategoryColor(cat.id),
                    } : {}}
                  >
                    <div className="text-lg mb-1">{cat.icon}</div>
                    <div className="text-[10px] text-gray-400">{cat.name}</div>
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Oylik limit (so'm)"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full p-3 bg-white/5 rounded-xl text-sm outline-none border border-transparent focus:border-[#00d68f] mb-3"
              />

              {limit && selectedCategory && (
                <div className="text-xs text-gray-400 mb-3 text-center">
                  Kunlik byudjet: {formatCurrency(Math.round(parseInt(limit) / 30))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 rounded-xl glass-card text-sm text-gray-400"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSave}
                  disabled={!selectedCategory || !limit}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory && limit
                      ? 'bg-[#00d68f] text-white'
                      : 'bg-white/10 text-gray-500'
                  }`}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-20 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      ) : budgets.length > 0 ? (
        <div className="space-y-3">
          {budgets.map((b, i) => {
            const pct = b.monthlyLimit > 0 ? Math.min(100, ((b.spent || 0) / b.monthlyLimit) * 100) : 0;
            const color = pct > 90 ? '#ff6b6b' : pct > 70 ? '#f59e0b' : '#00d68f';
            const dailyLimit = Math.round(b.monthlyLimit / 30);

            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${getCategoryColor(b.category)}20` }}>
                      {getCategoryIcon(b.category)}
                    </div>
                    <div>
                      <div className="text-sm font-medium capitalize">{b.category}</div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(b.spent || 0)} / {formatCurrency(b.monthlyLimit)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color }}>{pct.toFixed(0)}%</span>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1 text-gray-500 hover:text-[#ff6b6b]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>Kunlik: {formatCurrency(dailyLimit)}</span>
                  <span>Qolgan: {formatCurrency(Math.max(0, b.monthlyLimit - (b.spent || 0)))}</span>
                </div>
                {pct > 90 && (
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-[#ff6b6b]">
                    <AlertTriangle size={12} />
                    <span>Tejamkorlik qiling!</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Target size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 mb-2">Byudjet hali o'rnatilmagan</p>
          <p className="text-xs text-gray-500">+ tugmasini bosib byudjet qo'shing</p>
        </div>
      )}
    </div>
  );
}
