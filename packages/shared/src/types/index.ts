export interface UserInfo {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  isPremium?: boolean;
}

export interface TransactionData {
  id: string;
  userId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  description?: string;
  date: string;
  paymentMethod?: string;
  tags?: string[];
  receiptUrl?: string;
  isRecurring?: boolean;
  source: 'MANUAL' | 'VOICE' | 'AI' | 'RECURRING' | 'IMPORT';
  createdAt: string;
}

export interface BudgetData {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  currency: string;
  month: string;
  year: number;
  spent: number;
  remaining: number;
  isActive: boolean;
  notifyAt: number;
}

export interface GoalData {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: string;
  icon?: string;
  color?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
}

export interface AnalyticsData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savings: number;
  savingsRate: number;
  topCategories: { category: string; amount: number; percentage: number }[];
  dailySpending: { date: string; amount: number }[];
  weeklySpending: { week: string; amount: number }[];
  categoryDistribution: { category: string; amount: number; color: string }[];
  monthComparison: { month: string; income: number; expense: number }[];
}

export interface AIAdvice {
  score: number;
  summary: string;
  tips: string[];
  warnings: string[];
  forecast: string;
  topExpenses: { category: string; amount: number }[];
  savingsOpportunities: string[];
}

export interface VoiceParseResult {
  text: string;
  amount?: number;
  category?: string;
  type?: 'INCOME' | 'EXPENSE';
  description?: string;
  confidence: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardData {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  budgetProgress: BudgetData[];
  recentTransactions: TransactionData[];
  aiTip: string;
  monthlyGoal?: GoalData;
}
