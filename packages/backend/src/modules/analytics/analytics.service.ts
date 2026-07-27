import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(telegramId: number) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const startDate = new Date(year, now.getMonth(), 1);
    const endDate = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

    const [transactions, budgets, recentTransactions] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          userId: user.id,
          date: { gte: startDate, lte: endDate },
        },
      }),
      this.prisma.budget.findMany({
        where: { userId: user.id, month, year, isActive: true },
      }),
      this.prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 5,
      }),
    ]);

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100 * 10) / 10 : 0,
      budgetProgress: budgets,
      recentTransactions,
    };
  }

  async getAnalytics(telegramId: number) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
    });

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const expensesByCategory = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100 * 10) / 10 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const dailySpending = this.getDailySpending(transactions, startDate, endDate);

    const categoryColors: Record<string, string> = {
      food: '#ff6b6b', shopping: '#a855f7', transport: '#4ecdc4',
      education: '#3b82f6', bills: '#f59e0b', entertainment: '#ec4899',
      health: '#10b981', travel: '#06b6d4', investment: '#8b5cf6',
      clothing: '#f97316', gifts: '#e11d48', other_expense: '#6b7280',
    };

    const categoryDistribution = topCategories.map(c => ({
      category: c.category,
      amount: c.amount,
      color: categoryColors[c.category] || '#6b7280',
    }));

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      savings: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100 * 10) / 10 : 0,
      topCategories,
      dailySpending,
      categoryDistribution,
    };
  }

  private getDailySpending(transactions: any[], startDate: Date, endDate: Date) {
    const days: { date: string; amount: number }[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const dayTotal = transactions
        .filter(t => t.type === 'EXPENSE' && t.date.toISOString().split('T')[0] === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      days.push({ date: dateStr, amount: dayTotal });
      current.setDate(current.getDate() + 1);
    }

    return days;
  }
}
