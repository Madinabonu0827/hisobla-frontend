import { create } from 'zustand';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

interface Dashboard {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  savingsRate: number;
  budgetProgress: any[];
  recentTransactions: any[];
}

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  telegramId: string | null;
  setTelegramId: (id: string) => void;

  tgUser: TelegramUser | null;
  setTgUser: (user: TelegramUser | null) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  dashboard: Dashboard | null;
  setDashboard: (dashboard: Dashboard) => void;

  transactions: any[];
  setTransactions: (transactions: any[]) => void;

  analytics: any;
  setAnalytics: (analytics: any) => void;

  budgets: any[];
  setBudgets: (budgets: any[]) => void;

  goals: any[];
  setGoals: (goals: any[]) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;

  addModalType: 'expense' | 'income';
  setAddModalType: (type: 'expense' | 'income') => void;
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  telegramId: null,
  setTelegramId: (id) => set({ telegramId: id }),

  tgUser: null,
  setTgUser: (user) => set({ tgUser: user }),

  user: null,
  setUser: (user) => set({ user }),

  dashboard: null,
  setDashboard: (dashboard) => set({ dashboard }),

  transactions: [],
  setTransactions: (transactions) => set({ transactions }),

  analytics: null,
  setAnalytics: (analytics) => set({ analytics }),

  budgets: [],
  setBudgets: (budgets) => set({ budgets }),

  goals: [],
  setGoals: (goals) => set({ goals }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  showAddModal: false,
  setShowAddModal: (show) => set({ showAddModal: show }),

  addModalType: 'expense',
  setAddModalType: (type) => set({ addModalType: type }),
}));
