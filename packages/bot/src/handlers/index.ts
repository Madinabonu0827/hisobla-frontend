import { Telegraf, Context } from 'telegraf';
import { startHandler } from './start.handler';
import { transactionHandler } from './transaction.handler';
import { budgetHandler } from './budget.handler';
import { analyticsHandler } from './analytics.handler';
import { aiHandler } from './ai.handler';
import { voiceHandler } from './voice.handler';
import { goalHandler } from './goal.handler';
import { reportHandler } from './report.handler';
import { settingsHandler } from './settings.handler';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function setupHandlers(bot: Telegraf, webappUrl: string) {
  startHandler(bot, webappUrl);
  transactionHandler(bot);
  budgetHandler(bot);
  analyticsHandler(bot);
  aiHandler(bot);
  voiceHandler(bot);
  goalHandler(bot);
  reportHandler(bot);
  settingsHandler(bot);

  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return;

    const userState = (global as any).userStates?.[ctx.from.id];
    if (userState?.step === 'awaiting_amount') {
      await handleQuickTransaction(ctx, text, userState);
      return;
    }

    await ctx.reply(
      `❓ "${text}"\n\nMeni tushunmadim. Quyidagi buyruqlardan foydalaning:\n/start - Bosh sahifa\n/help - Yordam\n/voice - Ovozli kiritish`
    );
  });
}

async function handleQuickTransaction(ctx: Context, text: string, state: any) {
  const amount = parseInt(text.replace(/\D/g, ''));
  if (!amount || amount <= 0) {
    await ctx.reply('❓ Noto\'g\'ri miqdor. Iltimos, musbat raqam kiriting:');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId: ctx.from!.id,
        type: state.type,
        amount,
        category: state.category || 'other_expense',
        source: 'MANUAL',
      }),
    });

    const result: any = await response.json();

    if (result.success) {
      const emoji = state.type === 'INCOME' ? '💵' : '💸';
      const typeText = state.type === 'INCOME' ? 'Daromad' : 'Xarajat';
      await ctx.reply(
        `${emoji} *${typeText} qo'shildi!*\n\n💰 Miqdor: ${amount.toLocaleString()} so'm\n📂 Kategoriya: ${state.category || 'Boshqa'}`,
        { parse_mode: 'Markdown' }
      );
    } else {
      await ctx.reply('❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  } catch (error) {
    logger.error('Quick transaction xatolik:', error);
    await ctx.reply('❌ Server bilan bog\'lanishda xatolik.');
  }

  delete (global as any).userStates?.[ctx.from!.id];
}
