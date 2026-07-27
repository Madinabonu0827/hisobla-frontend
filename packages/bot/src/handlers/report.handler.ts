import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function reportHandler(bot: Telegraf) {
  bot.command('report', async (ctx) => {
    try {
      const res = await fetch(`${API_BASE}/api/reports/${ctx.from.id}/monthly`);
      const data: any = await res.json();

      if (data.success) {
        const d = data.data;
        let msg = `📄 *Oylik hisobot*\n\n`;
        msg += `📅 *Davr:* ${d.period}\n\n`;
        msg += `💵 *Umumiy daromad:* ${d.totalIncome.toLocaleString()} so'm\n`;
        msg += `💸 *Umumiy xarajat:* ${d.totalExpense.toLocaleString()} so'm\n`;
        msg += `💰 *Tejamkorlik:* ${d.savings.toLocaleString()} so'm\n`;
        msg += `📈 *Tejamkorlik darajasi:* ${d.savingsRate}%\n\n`;

        if (d.expensesByCategory?.length > 0) {
          msg += `📊 *Xarajatlar bo'yicha:*\n`;
          d.expensesByCategory.forEach((e: any) => {
            msg += `  ${e.category}: ${e.amount.toLocaleString()} so'm (${e.percentage}%)\n`;
          });
        }

        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('📭 Hali hisobot yo\'q');
      }
    } catch (e) {
      logger.error('Report xatolik:', e);
      await ctx.reply('❌ Hisobot olishda xatolik');
    }
  });
}
