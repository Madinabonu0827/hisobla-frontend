import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function analyticsHandler(bot: Telegraf) {
  bot.command('stats', async (ctx) => {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/${ctx.from.id}`);
      const data: any = await res.json();

      if (data.success) {
        const d = data.data;
        let msg = `📊 *Oylik statistika*\n\n`;
        msg += `💵 *Daromad:* ${d.totalIncome.toLocaleString()} so'm\n`;
        msg += `💸 *Xarajat:* ${d.totalExpense.toLocaleString()} so'm\n`;
        msg += `💰 *Balans:* ${d.balance.toLocaleString()} so'm\n`;
        msg += `📈 *Tejamkorlik:* ${d.savingsRate.toFixed(1)}%\n\n`;

        if (d.topCategories?.length > 0) {
          msg += `🏆 *Eng ko'p sarflangan:*\n`;
          d.topCategories.slice(0, 5).forEach((c: any, i: number) => {
            msg += `${i + 1}. ${c.category}: ${c.amount.toLocaleString()} so'm (${c.percentage}%)\n`;
          });
        }

        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('📭 Hali statistika yo\'q. Avval tranzaksiya qo\'shing!');
      }
    } catch (e) {
      logger.error('Stats xatolik:', e);
      await ctx.reply('❌ Statistika olishda xatolik');
    }
  });

  bot.action('stats', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      const res = await fetch(`${API_BASE}/api/analytics/${ctx.from.id}`);
      const data: any = await res.json();

      if (data.success) {
        const d = data.data;
        let msg = `📊 *Oylik statistika*\n\n`;
        msg += `💵 Daromad: ${d.totalIncome.toLocaleString()} so'm\n`;
        msg += `💸 Xarajat: ${d.totalExpense.toLocaleString()} so'm\n`;
        msg += `💰 Balans: ${d.balance.toLocaleString()} so'm\n`;
        msg += `📈 Tejamkorlik: ${d.savingsRate.toFixed(1)}%\n`;
        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('📭 Hali statistika yo\'q');
      }
    } catch (e) {
      logger.error('Stats action xatolik:', e);
      await ctx.reply('❌ Statistika olishda xatolik');
    }
  });
}
