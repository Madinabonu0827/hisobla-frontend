import { Controller, Post, Body } from '@nestjs/common';
import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {
  constructor(private voiceService: VoiceService) {}

  @Post('process')
  async processVoice(@Body() body: {
    telegramId: number;
    fileUrl: string;
    fileId?: string;
  }) {
    const result = await this.voiceService.processVoice(body.telegramId, body.fileUrl);
    return { success: true, data: result };
  }

  @Post('confirm')
  async confirmTransaction(@Body() body: {
    telegramId: number;
    amount: number;
    category: string;
    type: 'INCOME' | 'EXPENSE';
    description?: string;
  }) {
    const transaction = await this.voiceService.confirmVoiceTransaction(body.telegramId, body);
    return { success: true, data: transaction };
  }
}
