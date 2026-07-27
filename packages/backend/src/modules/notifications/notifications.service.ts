import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getDailyReminderUsers() {
    const users = await this.prisma.user.findMany({
      select: { id: true, telegramId: true, firstName: true },
    });
    return { users };
  }

  async getWeeklySummaryUsers() {
    const users = await this.prisma.user.findMany({
      select: { id: true, telegramId: true, firstName: true },
    });
    return { users };
  }

  async getMonthlyReportUsers() {
    const users = await this.prisma.user.findMany({
      select: { id: true, telegramId: true, firstName: true },
    });
    return { users };
  }

  async create(data: {
    telegramId: number;
    type: string;
    title: string;
    message: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(data.telegramId) },
    });
    if (!user) return;

    return this.prisma.notification.create({
      data: {
        userId: user.id,
        type: data.type,
        title: data.title,
        message: data.message,
      },
    });
  }

  async getUnread(telegramId: number) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
    if (!user) return [];

    return this.prisma.notification.findMany({
      where: { userId: user.id, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
