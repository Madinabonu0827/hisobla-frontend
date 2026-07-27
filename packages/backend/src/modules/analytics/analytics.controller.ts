import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard/:telegramId')
  async getDashboard(@Param('telegramId') telegramId: string) {
    const data = await this.analyticsService.getDashboard(parseInt(telegramId));
    return { success: true, data };
  }

  @Get(':telegramId')
  async getAnalytics(@Param('telegramId') telegramId: string) {
    const data = await this.analyticsService.getAnalytics(parseInt(telegramId));
    return { success: true, data };
  }
}
