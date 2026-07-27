import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    telegramId: number;
    type: 'INCOME' | 'EXPENSE';
    amount: number;
    currency?: string;
    category: string;
    subcategory?: string;
    description?: string;
    date?: string;
    paymentMethod?: string;
    tags?: string;
    source?: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(data.telegramId) },
    });

    if (!user) throw new Error('User not found');

    const transaction = await this.prisma.transaction.create({
      data: {
        userId: user.id,
        type: data.type,
        amount: data.amount,
        currency: data.currency || 'UZS',
        category: data.category,
        subcategory: data.subcategory,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        paymentMethod: data.paymentMethod as any,
        tags: data.tags || '[]',
        source: data.source as any || 'MANUAL',
      },
    });

    await this.updateBudgetSpent(user.id, data.category, data.amount, data.type);

    return transaction;
  }

  async findAll(telegramId: number, options?: {
    page?: number;
    limit?: number;
    month?: string;
    year?: number;
    type?: string;
    category?: string;
    search?: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });

    if (!user) throw new Error('User not found');

    const where: any = { userId: user.id };

    if (options?.month && options?.year) {
      const startDate = new Date(options.year, parseInt(options.month) - 1, 1);
      const endDate = new Date(options.year, parseInt(options.month), 0, 23, 59, 59);
      where.date = { gte: startDate, lte: endDate };
    }

    if (options?.type) where.type = options.type;
    if (options?.category) where.category = options.category;
    if (options?.search) {
      where.OR = [
        { description: { contains: options.search, mode: 'insensitive' } },
        { category: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const page = options?.page || 1;
    const limit = options?.limit || 20;

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<{
    type: string;
    amount: number;
    category: string;
    description: string;
    paymentMethod: string;
    tags: string;
  }>) {
    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }

  private async updateBudgetSpent(userId: string, category: string, amount: number, type: string) {
    if (type !== 'EXPENSE') return;

    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const budget = await this.prisma.budget.findUnique({
      where: {
        userId_category_month_year: { userId, category, month, year },
      },
    });

    if (budget) {
      const newSpent = budget.spent + amount;
      await this.prisma.budget.update({
        where: { id: budget.id },
        data: {
          spent: newSpent,
          remaining: Math.max(0, budget.monthlyLimit - newSpent),
        },
      });

      const percentage = (newSpent / budget.monthlyLimit) * 100;
      if (percentage >= 100) {
        await this.createNotification(userId, 'BUDGET_EXCEEDED',
          `${category} byudjet oshib ketdi!`,
          `${category} kategoriyasida ${newSpent.toLocaleString()} so'm sarflandi. Limit: ${budget.monthlyLimit.toLocaleString()} so'm.`
        );
      } else if (percentage >= budget.notifyAt) {
        await this.createNotification(userId, 'BUDGET_WARNING',
          `${category} byudjet yaqinlashmoqda`,
          `${category} kategoriyasida ${percentage.toFixed(0)}% sarflandi.`
        );
      }
    }
  }

  private async createNotification(userId: string, type: string, title: string, message: string) {
    await this.prisma.notification.create({
      data: { userId, type, title, message },
    });
  }
}
