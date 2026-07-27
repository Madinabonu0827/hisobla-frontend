import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { transactions: true } },
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      items: users.map(u => ({
        ...u,
        telegramId: u.telegramId,
        transactionCount: u._count.transactions,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByTelegramId(telegramId: number) {
    return this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
  }

  async getStats() {
    const [totalUsers, activeUsers, premiumUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          transactions: { some: {} },
        },
      }),
      this.prisma.user.count({ where: { isPremium: true } }),
    ]);

    return { totalUsers, activeUsers, premiumUsers };
  }
}
