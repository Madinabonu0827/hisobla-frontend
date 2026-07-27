import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function budgetHandler(bot: Telegraf) {
  bot.command('budget', async (ctx) => {
    try {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();

      const res = await fetch(`${API_BASE}/api/budgets/${ctx.from.id}?month=${month}&year=${year}`);
      const data: any = await res.json();

      if (data.success && data.data?.length > 0) {
        let msg = '🎯 *Byudjet holati:*\n\n';
        data.data.forEach((b: any) => {
          const percentage = b.monthlyLimit > 0 ? ((b.spent / b.monthlyLimit) * 100).toFixed(1) : '0';
          const bar = getProgressBar(parseFloat(percentage));
          msg += `📂 *${b.category}*\n`;
          msg += `${bar} ${percentage}%\n`;
          msg += `💸 Sarflangan: ${b.spent.toLocaleString()} so'm\n`;
          msg += `💰 Qolgan: ${b.remaining.toLocaleString()} so'm\n\n`;
        });
        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply(
          '🎯 *Byudjet hali o\'rnatilmagan*\n\n/setbudget buyrug\'ini ishlating:\n_Misol: /setbudget ovqat 2000000_',
          { parse_mode: 'Markdown' }
        );
      }
    } catch (e) {
      logger.error('Budget xatolik:', e);
      await ctx.reply('❌ Byudjet olishda xatolik');
    }
  });

  bot.command('setbudget', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < 2) {
      await ctx.reply(
        '🎯 *Byudjet o\'rnatish*\n\n' +
        'Foydalanish: /setbudget <kategoriya> <limit>\n' +
        '_Misol: /setbudget ovqat 2000000_',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    const category = args[0];
    const limit = parseInt(args[1]);

    if (isNaN(limit) || limit <= 0) {
      await ctx.reply('❌ Noto\'g\'ri miqdor. Musbat raqam kiriting.');
      return;
    }

    try {
      const now = new Date();
      const res = await fetch(`${API_BASE}/api/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: ctx.from.id,
          category,
          monthlyLimit: limit,
          month: String(now.getMonth() + 1).padStart(2, '0'),
          year: now.getFullYear(),
        }),
      });
      const data: any = await res.json();

      if (data.success) {
        await ctx.reply(
          `✅ *Byudjet o'rnatildi!*\n\n📂 Kategoriya: ${category}\n💰 Limit: ${limit.toLocaleString()} so'm/oy`,
          { parse_mode: 'Markdown' }
        );
      } else {
        await ctx.reply('❌ Byudjet o\'rnatishda xatolik');
      }
    } catch (e) {
      logger.error('Set budget xatolik:', e);
      await ctx.reply('❌ Byudjet o\'rnatishda xatolik');
    }
  });
}

function getProgressBar(percentage: number): string {
  const filled = Math.min(20, Math.round(percentage / 5));
  const empty = 20 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
