'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/hooks/useApi';
import { useStore } from '@/stores/useStore';
import { formatCurrency, formatCompact, getCategoryIcon, getCategoryColor } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
  CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, ArrowRight } from 'lucide-react';

export function AnalyticsPage() {
  const { telegramId } = useStore();
  const { data: analytics, loading } = useAnalytics(telegramId);
  const [activeChart, setActiveChart] = useState('bar');
  const [period, setPeriod] = useState('month');

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Statistika</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-48 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const a = analytics || {
    totalIncome: 0, totalExpense: 0, balance: 0, savings: 0, savingsRate: 0,
    topCategories: [], dailySpending: [], categoryDistribution: [],
    avgDailyExpense: 0, transactionCount: 0, incomeCount: 0, expenseCount: 0,
    topExpenseDay: null, topCategory: null,
  };

  const chartTypes = [
    { id: 'bar', label: 'Ustun' },
    { id: 'line', label: 'Chiziqli' },
    { id: 'area', label: 'Maydon' },
    { id: 'pie', label: 'Doira' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card p-3 text-xs shadow-lg">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Statistika</h1>
        <div className="flex gap-1">
          {['week', 'month', 'all'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                period === p ? 'bg-[#4ecdc4] text-white' : 'text-gray-500'
              }`}
            >
              {p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : 'Hammasi'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#00d68f]" />
            <span className="text-xs text-gray-400">Daromad</span>
          </div>
          <div className="text-xl font-bold text-[#00d68f]">{formatCompact(a.totalIncome)}</div>
          <div className="text-[10px] text-gray-500 mt-1">{a.incomeCount || 0} ta tranzaksiya</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-[#ff6b6b]" />
            <span className="text-xs text-gray-400">Xarajat</span>
          </div>
          <div className="text-xl font-bold text-[#ff6b6b]">{formatCompact(a.totalExpense)}</div>
          <div className="text-[10px] text-gray-500 mt-1">{a.expenseCount || 0} ta tranzaksiya</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[#4ecdc4]" />
            <span className="text-xs text-gray-400">Balans</span>
          </div>
          <div className="text-xl font-bold text-[#4ecdc4]">{formatCompact(a.balance)}</div>
          <div className="text-[10px] text-gray-500 mt-1">Kunlik o'rtacha: {formatCurrency(a.avgDailyExpense || 0)}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Percent size={16} className="text-[#a855f7]" />
            <span className="text-xs text-gray-400">Tejamkorlik</span>
          </div>
          <div className="text-xl font-bold text-[#a855f7]">{a.savingsRate || 0}%</div>
          <div className="text-[10px] text-gray-500 mt-1">{a.transactionCount || 0} jami tranzaksiya</div>
        </motion.div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2 mb-4">
        {chartTypes.map((ct) => (
          <button
            key={ct.id}
            onClick={() => setActiveChart(ct.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeChart === ct.id
                ? 'bg-[#4ecdc4] text-white'
                : 'glass-card text-gray-400'
            }`}
          >
            {ct.label}
          </button>
        ))}
      </div>

      {/* Daily Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-4 mb-6"
      >
        <h3 className="text-sm font-semibold mb-4">Kunlik xarajatlar</h3>
        <div className="h-52">
          {a.dailySpending && a.dailySpending.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'bar' ? (
                <BarChart data={a.dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(v) => v.split('-')[2]} />
                  <YAxis tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(v) => formatCompact(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff6b6b" />
                      <stop offset="100%" stopColor="#ff6b6b" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </BarChart>
              ) : activeChart === 'line' ? (
                <LineChart data={a.dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(v) => v.split('-')[2]} />
                  <YAxis tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(v) => formatCompact(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="amount" stroke="#4ecdc4" strokeWidth={2} dot={{ fill: '#4ecdc4', r: 3 }} />
                </LineChart>
              ) : activeChart === 'area' ? (
                <AreaChart data={a.dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(v) => v.split('-')[2]} />
                  <YAxis tick={{ fontSize: 10, fill: '#666' }} tickFormatter={(v) => formatCompact(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="amount" stroke="#a855f7" fill="url(#areaGrad)" strokeWidth={2} />
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie
                    data={a.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {a.categoryDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || getCategoryColor(entry.category)} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Ma'lumot yo'q
            </div>
          )}
        </div>
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-4 mb-6"
      >
        <h3 className="text-sm font-semibold mb-4">Kategoriyalar bo'yicha</h3>
        {a.topCategories && a.topCategories.length > 0 ? (
          <div className="space-y-3">
            {a.topCategories.map((cat: any, i: number) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(cat.category)}</span>
                    <span className="text-sm capitalize">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatCurrency(cat.amount || 0)}</span>
                    <span className="text-xs text-gray-400 ml-2">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: getCategoryColor(cat.category) }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Ma'lumot yo'q</p>
        )}
      </motion.div>

      {/* Insights */}
      {(a.topExpenseDay || a.topCategory) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 mb-6"
        >
          <h3 className="text-sm font-semibold mb-3">Tahlil</h3>
          <div className="space-y-2">
            {a.topCategory && (
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span>{getCategoryIcon(a.topCategory)}</span>
                <span>Eng ko'p sarflangan kategoriya: <span className="text-[#ff6b6b] font-medium capitalize">{a.topCategory}</span></span>
              </div>
            )}
            {a.topExpenseDay && (
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Calendar size={14} />
                <span>Eng ko'p sarflangan kun: <span className="text-[#f59e0b] font-medium">{a.topExpenseDay}</span></span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
