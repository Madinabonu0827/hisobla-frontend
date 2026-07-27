'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import { X, Check, ChevronDown } from 'lucide-react';
import { getCategoryIcon, getCategoryColor } from '@/lib/utils';
import apiClient from '@/lib/api';

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Ovqat', icon: '🍔' },
  { id: 'shopping', name: 'Xarid', icon: '🛍️' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'education', name: 'Ta\'lim', icon: '📚' },
  { id: 'bills', name: 'Kommunal', icon: '🏠' },
  { id: 'entertainment', name: 'Ko\'ngil', icon: '🎮' },
  { id: 'health', name: 'Salomatlik', icon: '🏥' },
  { id: 'clothing', name: 'Kiyim', icon: '👕' },
  { id: 'gifts', name: 'Sovg\'alar', icon: '🎁' },
  { id: 'other_expense', name: 'Boshqa', icon: '📦' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Oylik', icon: '💵' },
  { id: 'business', name: 'Biznes', icon: '🏢' },
  { id: 'freelance', name: 'Freelance', icon: '💻' },
  { id: 'gift_income', name: 'Sovga', icon: '🎁' },
  { id: 'investment_income', name: 'Investitsiya', icon: '📈' },
  { id: 'other_income', name: 'Boshqa', icon: '💰' },
];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Naqd', icon: '💵' },
  { id: 'uzcard', name: 'UzCard', icon: '💳' },
  { id: 'humo', name: 'Humo', icon: '💳' },
  { id: 'payme', name: 'Payme', icon: '📱' },
  { id: 'click', name: 'Click', icon: '📱' },
];

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

export function AddTransactionModal() {
  const { showAddModal, setShowAddModal, addModalType, telegramId } = useStore();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = addModalType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isExpense = addModalType === 'expense';

  const handleSubmit = async () => {
    if (!amount || !category || !telegramId) return;
    setIsSubmitting(true);

    try {
      await apiClient.post('/transactions', {
        telegramId,
        type: addModalType === 'expense' ? 'EXPENSE' : 'INCOME',
        amount: parseFloat(amount),
        category,
        description,
        paymentMethod,
        source: 'MANUAL',
      });

      setAmount('');
      setCategory('');
      setDescription('');
      setPaymentMethod('cash');
      setSuccess(true);
      setTimeout(() => {
        setShowAddModal(false);
        setSuccess(false);
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showAddModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 flex items-end justify-center"
        onClick={() => setShowAddModal(false)}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-[#111127] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${isExpense ? 'bg-[#ff6b6b]/20' : 'bg-[#00d68f]/20'}`}>
                {isExpense ? '💸' : '💵'}
              </div>
              <h2 className="text-lg font-semibold">
                {isExpense ? 'Xarajat qo\'shish' : 'Daromad qo\'shish'}
              </h2>
            </div>
            <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-white/5">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <div className="text-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-5xl font-bold bg-transparent text-center outline-none w-full placeholder-gray-700"
                autoFocus
              />
              <div className="text-sm text-gray-400 mt-2">so'm</div>
            </div>
            {/* Quick amounts */}
            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              {QUICK_AMOUNTS.map((qa) => (
                <button
                  key={qa}
                  onClick={() => setAmount(String(qa))}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    parseInt(amount) === qa
                      ? 'bg-[#4ecdc4]/20 border border-[#4ecdc4] text-[#4ecdc4]'
                      : 'glass-card text-gray-400'
                  }`}
                >
                  {qa >= 1000000 ? `${qa / 1000000}M` : `${qa / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-3">Kategoriya</div>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl text-center transition-all ${
                    category === cat.id
                      ? 'border-2'
                      : 'glass-card border border-transparent'
                  }`}
                  style={category === cat.id ? {
                    backgroundColor: `${getCategoryColor(cat.id)}15`,
                    borderColor: getCategoryColor(cat.id),
                  } : {}}
                >
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <div className="text-[9px] text-gray-400">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          {isExpense && (
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-3">To'lov usuli</div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                      paymentMethod === pm.id
                        ? 'bg-[#4ecdc4]/20 border border-[#4ecdc4] text-[#4ecdc4]'
                        : 'glass-card border border-transparent text-gray-400'
                    }`}
                  >
                    <span>{pm.icon}</span>
                    <span>{pm.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Tavsif (ixtiyoriy)</div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qo'shimcha ma'lumot..."
              className="w-full p-3 bg-white/5 rounded-xl text-sm outline-none border border-transparent focus:border-[#4ecdc4]"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!amount || !category || isSubmitting}
            className={`w-full py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              amount && category && !isSubmitting
                ? isExpense
                  ? 'bg-gradient-to-r from-[#ff6b6b] to-[#ffa500]'
                  : 'bg-gradient-to-r from-[#00d68f] to-[#00b4d8]'
                : 'bg-white/10 text-gray-500'
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check size={20} />
                <span>Saqlandi!</span>
              </motion.div>
            ) : (
              <>
                <Check size={20} />
                <span>Saqlash</span>
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
