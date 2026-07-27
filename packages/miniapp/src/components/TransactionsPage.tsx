'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions } from '@/hooks/useApi';
import { useStore } from '@/stores/useStore';
import { formatCurrency, formatTime, formatDate, getCategoryIcon, getCategoryColor } from '@/lib/utils';
import { Search, Plus, Trash2, ArrowUpRight, ArrowDownRight, Filter, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import apiClient from '@/lib/api';

export function TransactionsPage() {
  const { telegramId, setShowAddModal, setAddModalType } = useStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (filterType) params.type = filterType;
  if (filterCategory) params.category = filterCategory;

  const { data, loading, refetch } = useTransactions(telegramId, params);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/transactions/${id}`);
      showToast('Tranzaksiya o\'chirildi', 'success');
      refetch();
    } catch (err) {
      showToast('O\'chirishda xatolik', 'error');
    }
  }, [refetch, showToast]);

  const totalIncome = data.items?.filter((t: any) => t.type === 'INCOME').reduce((s: number, t: any) => s + t.amount, 0) || 0;
  const totalExpense = data.items?.filter((t: any) => t.type === 'EXPENSE').reduce((s: number, t: any) => s + t.amount, 0) || 0;

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tranzaksiyalar</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              showFilters || filterType || filterCategory ? 'bg-[#4ecdc4]/20' : 'bg-white/5'
            }`}
          >
            <Filter size={18} className={showFilters || filterType || filterCategory ? 'text-[#4ecdc4]' : 'text-gray-400'} />
          </button>
          <button
            onClick={() => { setAddModalType('expense'); setShowAddModal(true); }}
            className="w-10 h-10 rounded-full bg-[#00d68f]/20 flex items-center justify-center"
          >
            <Plus size={20} className="text-[#00d68f]" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="glass-card p-3 text-center">
          <div className="text-[10px] text-gray-500 mb-1">Daromad</div>
          <div className="text-sm font-semibold text-[#00d68f]">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-[10px] text-gray-500 mb-1">Xarajat</div>
          <div className="text-sm font-semibold text-[#ff6b6b]">{formatCurrency(totalExpense)}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-[10px] text-gray-500 mb-1">Soni</div>
          <div className="text-sm font-semibold text-[#4ecdc4]">{data.items?.length || 0}</div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-3 mb-4 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-gray-400">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="glass-card p-3">
              <div className="text-xs text-gray-400 mb-2">Tur</div>
              <div className="flex gap-2 mb-3">
                {['', 'INCOME', 'EXPENSE'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterType === type
                        ? type === 'INCOME' ? 'bg-[#00d68f] text-white' : type === 'EXPENSE' ? 'bg-[#ff6b6b] text-white' : 'bg-[#4ecdc4] text-white'
                        : 'glass-card text-gray-400'
                    }`}
                  >
                    {type === '' ? 'Hammasi' : type === 'INCOME' ? '💵 Daromad' : '💸 Xarajat'}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-400 mb-2">Kategoriya</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['', 'food', 'shopping', 'transport', 'education', 'bills', 'entertainment', 'health', 'salary', 'business', 'freelance'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                      filterCategory === cat
                        ? 'bg-[#4ecdc4] text-white'
                        : 'glass-card text-gray-400'
                    }`}
                  >
                    {cat ? `${getCategoryIcon(cat)} ${cat}` : 'Hammasi'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="glass-card p-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5" />
                <div className="flex-1">
                  <div className="h-4 bg-white/5 rounded w-24 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-16" />
                </div>
                <div className="h-4 bg-white/5 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : data.items && data.items.length > 0 ? (
        <div className="space-y-2">
          {data.items.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-3 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: `${getCategoryColor(t.category)}20` }}
              >
                {getCategoryIcon(t.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.description || t.category}</div>
                <div className="text-xs text-gray-500">
                  {getCategoryIcon(t.category)} {t.category} · {formatDate(t.date)} {formatTime(t.date)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-sm font-semibold ${t.type === 'INCOME' ? 'text-[#00d68f]' : 'text-[#ff6b6b]'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
                {t.paymentMethod && (
                  <div className="text-[10px] text-gray-600">{t.paymentMethod}</div>
                )}
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-2 text-gray-500 hover:text-[#ff6b6b] transition-colors flex-shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-400 mb-2">Tranzaksiya topilmadi</p>
          <p className="text-xs text-gray-500">Filter yoki qidiruv so'zlarini o'zgartiring</p>
        </div>
      )}
    </div>
  );
}
