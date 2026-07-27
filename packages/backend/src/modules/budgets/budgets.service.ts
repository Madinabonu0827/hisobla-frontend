import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(data: {
    telegramId: number;
    category: string;
    monthlyLimit: number;
    month?: string;
    year?: number;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(data.telegramId) },
    });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const month = data.month || String(now.getMonth() + 1).padStart(2, '0');
    const year = data.year || now.getFullYear();

    const existing = await this.prisma.budget.findUnique({
      where: {
        userId_category_month_year: {
          userId: user.id,
          category: data.category,
          month,
          year,
        },
      },
    });

    if (existing) {
      return this.prisma.budget.update({
        where: { id: existing.id },
        data: {
          monthlyLimit: data.monthlyLimit,
          remaining: Math.max(0, data.monthlyLimit - existing.spent),
        },
      });
    }

    return this.prisma.budget.create({
      data: {
        userId: user.id,
        category: data.category,
        monthlyLimit: data.monthlyLimit,
        month,
        year,
        remaining: data.monthlyLimit,
      },
    });
  }

  async findAll(telegramId: number, month?: string, year?: number) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const m = month || String(now.getMonth() + 1).padStart(2, '0');
    const y = year || now.getFullYear();

    return this.prisma.budget.findMany({
      where: {
        userId: user.id,
        month: m,
        year: y,
        isActive: true,
      },
      orderBy: { category: 'asc' },
    });
  }

  async delete(id: string) {
    return this.prisma.budget.delete({ where: { id } });
  }
}
