import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { BudgetsService } from './budgets.service';

@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  async createOrUpdate(@Body() body: {
    telegramId: number;
    category: string;
    monthlyLimit: number;
    month?: string;
    year?: number;
  }) {
    const budget = await this.budgetsService.createOrUpdate(body);
    return { success: true, data: budget };
  }

  @Get(':telegramId')
  async findAll(
    @Param('telegramId') telegramId: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const budgets = await this.budgetsService.findAll(
      parseInt(telegramId),
      month,
      year ? parseInt(year) : undefined,
    );
    return { success: true, data: budgets };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.budgetsService.delete(id);
    return { success: true };
  }
}
