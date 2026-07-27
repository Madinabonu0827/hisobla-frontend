import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('daily-reminder')
  async getDailyReminder() {
    const data = await this.notificationsService.getDailyReminderUsers();
    return { success: true, data };
  }

  @Get('weekly-summary')
  async getWeeklySummary() {
    const data = await this.notificationsService.getWeeklySummaryUsers();
    return { success: true, data };
  }

  @Get('monthly-report')
  async getMonthlyReport() {
    const data = await this.notificationsService.getMonthlyReportUsers();
    return { success: true, data };
  }

  @Get(':telegramId/unread')
  async getUnread(@Param('telegramId') telegramId: string) {
    const notifications = await this.notificationsService.getUnread(parseInt(telegramId));
    return { success: true, data: notifications };
  }
}
