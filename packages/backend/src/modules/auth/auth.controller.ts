import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sync')
  async syncUser(@Body() body: {
    telegramId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    languageCode?: string;
    isPremium?: boolean;
  }) {
    const user = await this.authService.syncUser(body);
    return { success: true, data: user };
  }

  @Get('user/:telegramId')
  async getUser(@Param('telegramId') telegramId: string) {
    const user = await this.authService.findUserByTelegramId(parseInt(telegramId));
    return { success: true, data: user };
  }
}
