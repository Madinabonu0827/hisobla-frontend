import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function transactionHandler(bot: Telegraf) {
  bot.command('add', async (ctx) => {
    const { CATEGORIES } = await import('@hisob/shared');
    const categories = CATEGORIES.EXPENSE.map(c => `${c.icon} ${c.name}`).join('\n');
    await ctx.reply(
      `💸 *Xarajat qo'shish*\n\nKategoriyani tanlang:\n\n${categories}\n\n_Va miqdorni kiriting_\n_Misol: ovqat 50000_`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('income', async (ctx) => {
    const { CATEGORIES } = await import('@hisob/shared');
    const categories = CATEGORIES.INCOME.map(c => `${c.icon} ${c.name}`).join('\n');
    await ctx.reply(
      `💵 *Daromad qo'shish*\n\nKategoriyani tanlang:\n\n${categories}\n\n_Va miqdorni kiriting_\n_Misol: oylik 5000000_`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('balance', async (ctx) => {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/${ctx.from.id}`);
      const data: any = await res.json();

      if (data.success) {
        const d = data.data;
        await ctx.reply(
          `💰 *Balansingiz:*\n\n` +
          `💵 Daromad: *${d.totalIncome.toLocaleString()}* so'm\n` +
          `💸 Xarajat: *${d.totalExpense.toLocaleString()}* so'm\n` +
          `🏦 Balans: *${d.balance.toLocaleString()}* so'm\n` +
          `📈 Tejamkorlik: *${d.savingsRate.toFixed(1)}%*`,
          { parse_mode: 'Markdown' }
        );
      } else {
        await ctx.reply('📭 Hali tranzaksiya yo\'q');
      }
    } catch (e) {
      logger.error('Balance xatolik:', e);
      await ctx.reply('❌ Balans olishda xatolik');
    }
  });

  bot.command('history', async (ctx) => {
    try {
      const res = await fetch(`${API_BASE}/api/transactions/${ctx.from.id}?limit=10`);
      const data: any = await res.json();

      if (data.success && data.data?.items?.length > 0) {
        let msg = '📋 *Oxirgi tranzaksiyalar:*\n\n';
        data.data.items.forEach((t: any) => {
          const emoji = t.type === 'INCOME' ? '💵' : '💸';
          const sign = t.type === 'INCOME' ? '+' : '-';
          msg += `${emoji} ${sign}${t.amount.toLocaleString()} so'm - ${t.category}\n`;
        });
        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('📭 Hali tranzaksiya yo\'q');
      }
    } catch (e) {
      logger.error('History xatolik:', e);
      await ctx.reply('❌ Tarix olishda xatolik');
    }
  });
}
