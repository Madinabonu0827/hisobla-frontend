import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() body: {
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
    const transaction = await this.transactionsService.create(body);
    return { success: true, data: transaction };
  }

  @Get(':telegramId')
  async findAll(
    @Param('telegramId') telegramId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.transactionsService.findAll(parseInt(telegramId), {
      page: parseInt(page || '1'),
      limit: parseInt(limit || '20'),
      month,
      year: year ? parseInt(year) : undefined,
      type,
      category,
      search,
    });
    return { success: true, data: result };
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    const transaction = await this.transactionsService.findOne(id);
    return { success: true, data: transaction };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const transaction = await this.transactionsService.update(id, body);
    return { success: true, data: transaction };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.transactionsService.delete(id);
    return { success: true };
  }
}
