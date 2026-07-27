import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get(':telegramId/monthly')
  async getMonthlyReport(@Param('telegramId') telegramId: string) {
    const report = await this.reportsService.getMonthlyReport(parseInt(telegramId));
    return { success: true, data: report };
  }
}
