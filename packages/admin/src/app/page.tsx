'use client';

import { useState, useEffect } from 'react';
import { Users, ArrowLeftRight, DollarSign, Activity, BarChart3, Settings, Shield, Brain } from 'lucide-react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeUsers: 0, premiumUsers: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/users/stats`),
          axios.get(`${API_BASE}/api/users?limit=10`),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (usersRes.data.success) setUsers(usersRes.data.data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Jami foydalanuvchilar', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
    { label: 'Faol foydalanuvchilar', value: stats.activeUsers, icon: Activity, color: '#00d68f' },
    { label: 'Premium foydalanuvchilar', value: stats.premiumUsers, icon: Shield, color: '#a855f7' },
  ];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400">Hisob Bot boshqaruv paneli</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30">
            <BarChart3 size={16} className="inline mr-1" /> Statistika
          </button>
          <button className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30">
            <Brain size={16} className="inline mr-1" /> AI Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <span className="text-sm text-gray-400">{card.label}</span>
            </div>
            <div className="text-3xl font-bold">{card.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-semibold">Foydalanuvchilar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-white/5">
                <th className="p-4">ID</th>
                <th className="p-4">Telegram ID</th>
                <th className="p-4">Ism</th>
                <th className="p-4">Username</th>
                <th className="p-4">Premium</th>
                <th className="p-4">Sana</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Yuklanmoqda...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-sm font-mono">{user.id.slice(0, 8)}...</td>
                    <td className="p-4 text-sm">{user.telegramId}</td>
                    <td className="p-4 text-sm">{user.firstName || '-'}</td>
                    <td className="p-4 text-sm text-gray-400">@{user.username || '-'}</td>
                    <td className="p-4">
                      {user.isPremium ? (
                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">Premium</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs">Oddiy</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Foydalanuvchilar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {[
          { label: 'Transaksiyalar', icon: ArrowLeftRight, color: '#3b82f6' },
          { label: 'Hisobotlar', icon: BarChart3, color: '#00d68f' },
          { label: 'AI Logs', icon: Brain, color: '#a855f7' },
          { label: 'Sozlamalar', icon: Settings, color: '#f59e0b' },
        ].map((action) => (
          <button
            key={action.label}
            className="bg-[#1e293b] rounded-xl p-4 border border-white/5 hover:bg-[#334155] transition-colors text-center"
          >
            <action.icon size={24} className="mx-auto mb-2" style={{ color: action.color }} />
            <span className="text-sm">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
