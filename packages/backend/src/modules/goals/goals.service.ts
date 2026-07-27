import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    telegramId: number;
    name: string;
    description?: string;
    targetAmount: number;
    deadline?: string;
    icon?: string;
    color?: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(data.telegramId) },
    });
    if (!user) throw new Error('User not found');

    return this.prisma.goal.create({
      data: {
        userId: user.id,
        name: data.name,
        description: data.description,
        targetAmount: data.targetAmount,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        icon: data.icon || '🎯',
        color: data.color || '#00d68f',
      },
    });
  }

  async findAll(telegramId: number) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
    if (!user) throw new Error('User not found');

    return this.prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAmount(id: string, amount: number) {
    const goal = await this.prisma.goal.findUnique({ where: { id } });
    if (!goal) throw new Error('Goal not found');

    const newAmount = goal.currentAmount + amount;
    const status = newAmount >= goal.targetAmount ? 'COMPLETED' : goal.status;

    return this.prisma.goal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        status,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.goal.delete({ where: { id } });
  }
}
