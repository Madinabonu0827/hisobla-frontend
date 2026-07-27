import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const result = await this.usersService.findAll(
      parseInt(page || '1'),
      parseInt(limit || '20'),
    );
    return { success: true, data: result };
  }

  @Get('stats')
  async getStats() {
    const stats = await this.usersService.getStats();
    return { success: true, data: stats };
  }

  @Get(':telegramId')
  async findByTelegramId(@Param('telegramId') telegramId: string) {
    const user = await this.usersService.findByTelegramId(parseInt(telegramId));
    return { success: true, data: user };
  }
}
