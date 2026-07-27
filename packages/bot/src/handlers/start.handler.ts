import { Telegraf } from 'telegraf';
import { WELCOME_MESSAGE } from '@hisob/shared';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function startHandler(bot: Telegraf, webappUrl: string) {
  bot.start(async (ctx) => {
    const user = ctx.from;

    try {
      const res = await fetch(`${API_BASE}/api/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          languageCode: user.language_code,
          isPremium: (user as any).is_premium || false,
        }),
      });
      if (!res.ok) {
        logger.warn(`User sync failed: HTTP ${res.status}`);
      }
    } catch (e) {
      logger.error('User sync xatoligi:', e);
    }

    await ctx.reply(WELCOME_MESSAGE, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Open Mini App', web_app: { url: webappUrl } }],
          [{ text: '📊 Tezkor statistika', callback_data: 'quick_stats' }],
          [{ text: '💰 Tezkor xarajat', callback_data: 'quick_expense' }],
          [{ text: '💵 Tezkor daromad', callback_data: 'quick_income' }],
        ],
      },
    });
  });

  bot.action('quick_stats', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      const res = await fetch(`${API_BASE}/api/analytics/${ctx.from.id}`);
      const data: any = await res.json();

      if (data.success) {
        const d = data.data;
        await ctx.reply(
          `📊 *Oylik statistika:*\n\n` +
          `💵 Daromad: ${d.totalIncome.toLocaleString()} so'm\n` +
          `💸 Xarajat: ${d.totalExpense.toLocaleString()} so'm\n` +
          `💰 Balans: ${d.balance.toLocaleString()} so'm\n` +
          `📈 Tejamkorlik: ${d.savingsRate.toFixed(1)}%\n\n` +
          `_Batafsil Mini App da ko'rishingiz mumkin_`,
          { parse_mode: 'Markdown' }
        );
      } else {
        await ctx.reply('📭 Hali statistika yo\'q. Avval tranzaksiya qo\'shing!');
      }
    } catch (e) {
      logger.error('quick_stats xatolik:', e);
      await ctx.reply('❌ Statistika olishda xatolik');
    }
  });

  bot.action('quick_expense', async (ctx) => {
    await ctx.answerCbQuery();
    if (!(global as any).userStates) (global as any).userStates = {};
    (global as any).userStates[ctx.from.id] = { step: 'awaiting_amount', type: 'EXPENSE' };
    await ctx.reply(
      '💸 *Xarajat qo\'shish*\n\nIltimos, miqdorni kiriting (so\'mda):\n\n_Misol: 50000 yoki 150000_',
      { parse_mode: 'Markdown' }
    );
  });

  bot.action('quick_income', async (ctx) => {
    await ctx.answerCbQuery();
    if (!(global as any).userStates) (global as any).userStates = {};
    (global as any).userStates[ctx.from.id] = { step: 'awaiting_amount', type: 'INCOME' };
    await ctx.reply(
      '💵 *Daromad qo\'shish*\n\nIltimos, miqdorni kiriting (so\'mda):\n\n_Misol: 5000000 yoki 7000000_',
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      '📚 *Buyruqlar ro\'yxati:*\n\n' +
      '/start - Botni ishga tushirish\n' +
      '/balance - Balansni ko\'rish\n' +
      '/add - Xarajat qo\'shish\n' +
      '/income - Daromad qo\'shish\n' +
      '/stats - Oylik statistika\n' +
      '/budget - Byudjet boshqaruvi\n' +
      '/goals - Moliyaviy maqsadlar\n' +
      '/advice - AI maslahat\n' +
      '/voice - Ovozli kiritish\n' +
      '/history - Tarix\n' +
      '/report - Hisobot\n' +
      '/settings - Sozlamalar',
      { parse_mode: 'Markdown' }
    );
  });
}
