import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(data: {
    telegramId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    languageCode?: string;
    isPremium?: boolean;
  }) {
    const tid = String(data.telegramId);
    const existing = await this.prisma.user.findUnique({
      where: { telegramId: tid },
    });

    if (existing) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          languageCode: data.languageCode,
          isPremium: data.isPremium || false,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        telegramId: tid,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        languageCode: data.languageCode || 'uz',
        isPremium: data.isPremium || false,
      },
    });
  }

  async findUserByTelegramId(telegramId: number) {
    return this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
