import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  async create(@Body() body: {
    telegramId: number;
    name: string;
    description?: string;
    targetAmount: number;
    deadline?: string;
    icon?: string;
    color?: string;
  }) {
    const goal = await this.goalsService.create(body);
    return { success: true, data: goal };
  }

  @Get(':telegramId')
  async findAll(@Param('telegramId') telegramId: string) {
    const goals = await this.goalsService.findAll(parseInt(telegramId));
    return { success: true, data: goals };
  }

  @Put(':id/amount')
  async updateAmount(@Param('id') id: string, @Body() body: { amount: number }) {
    const goal = await this.goalsService.updateAmount(id, body.amount);
    return { success: true, data: goal };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.goalsService.delete(id);
    return { success: true };
  }
}
