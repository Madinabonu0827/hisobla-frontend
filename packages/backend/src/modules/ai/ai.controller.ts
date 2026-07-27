import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private aiService: AIService) {}

  @Post('advice')
  async getAdvice(@Body() body: { telegramId: number }) {
    const advice = await this.aiService.getAdvice(body.telegramId);
    return { success: true, data: advice };
  }

  @Post('chat')
  async chat(@Body() body: { telegramId: number; message: string }) {
    const result = await this.aiService.chat(body.telegramId, body.message);
    return { success: true, data: result };
  }

  @Post('score')
  async getScore(@Body() body: { telegramId: number }) {
    const result = await this.aiService.getScore(body.telegramId);
    return { success: true, data: result };
  }
}
