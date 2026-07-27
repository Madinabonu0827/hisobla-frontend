import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function goalHandler(bot: Telegraf) {
  bot.command('goals', async (ctx) => {
    try {
      const res = await fetch(`${API_BASE}/api/goals/${ctx.from.id}`);
      const data: any = await res.json();

      if (data.success && data.data?.length > 0) {
        let msg = '🎯 *Moliyaviy maqsadlar:*\n\n';
        data.data.forEach((g: any) => {
          const percentage = g.targetAmount > 0 ? ((g.currentAmount / g.targetAmount) * 100).toFixed(1) : '0';
          msg += `${g.icon || '🎯'} *${g.name}*\n`;
          msg += `💰 ${g.currentAmount.toLocaleString()} / ${g.targetAmount.toLocaleString()} so'm\n`;
          msg += `📊 ${percentage}%\n\n`;
        });
        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply(
          '🎯 *Moliyaviy maqsadlar*\n\n' +
          'Hali maqsad yo\'q. Mini App orqali qo\'shing!\n' +
          '_Maqsad sizga motivatsiya beradi._',
          { parse_mode: 'Markdown' }
        );
      }
    } catch (e) {
      logger.error('Goals xatolik:', e);
      await ctx.reply('❌ Maqsadlarni olishda xatolik');
    }
  });
}
