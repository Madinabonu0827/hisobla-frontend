import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function aiHandler(bot: Telegraf) {
  bot.command('advice', async (ctx) => {
    await ctx.reply('🤖 AI maslahat tayyorlanmoqda...');

    try {
      const res = await fetch(`${API_BASE}/api/ai/advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: ctx.from.id }),
      });
      const data: any = await res.json();

      if (data.success) {
        const d = data.data;
        let msg = `🤖 *AI Moliyaviy Maslahat*\n\n`;
        msg += `📊 *Moliyaviy ball:* ${getScoreEmoji(d.score)} ${d.score}/100\n\n`;
        msg += `📝 *Xulosa:* ${d.summary}\n\n`;

        if (d.warnings?.length > 0) {
          msg += `⚠️ *Ogohlantirishlar:*\n`;
          d.warnings.forEach((w: string) => { msg += `• ${w}\n`; });
          msg += '\n';
        }

        if (d.tips?.length > 0) {
          msg += `💡 *Maslahatlar:*\n`;
          d.tips.forEach((t: string) => { msg += `• ${t}\n`; });
          msg += '\n';
        }

        if (d.forecast) {
          msg += `🔮 *Prognoz:* ${d.forecast}\n`;
        }

        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('❌ AI maslahat olishda xatolik');
      }
    } catch (e) {
      logger.error('AI advice xatolik:', e);
      await ctx.reply('❌ AI maslahat olishda xatolik');
    }
  });

  bot.command('chat', async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1).join(' ');
    if (!args) {
      await ctx.reply(
        '🤖 *AI bilan suhbat*\n\nSavolingizni yozing:\n\n_Misol: /chat Qancha pul sarfladim?_',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    await ctx.reply('🤖 Javob tayyorlanmoqda...');

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: ctx.from.id, message: args }),
      });
      const data: any = await res.json();

      if (data.success) {
        await ctx.reply(`🤖 ${data.data.response}`, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('❌ Javob olishda xatolik');
      }
    } catch (e) {
      logger.error('AI chat xatolik:', e);
      await ctx.reply('❌ AI bilan bog\'lanishda xatolik');
    }
  });

  bot.command('score', async (ctx) => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: ctx.from.id }),
      });
      const data: any = await res.json();

      if (data.success) {
        const score = data.data.score;
        const emoji = getScoreEmoji(score);
        let msg = `${emoji} *Moliyaviy ball: ${score}/100*\n\n`;

        if (score >= 80) msg += '🌟 *Ajoyib!* Sizning moliyaviy holatingiz juda yaxshi.';
        else if (score >= 60) msg += '👍 *Yaxshi!* Lekin yaxshilash imkoniyatlari bor.';
        else if (score >= 40) msg += '😐 *O\'rtacha.* Ehtiyot bo\'lish kerak.';
        else msg += '⚠️ *Diqqat!* Jiddiy o\'zgarishlar kerak.';

        await ctx.reply(msg, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply('❌ Ball olishda xatolik');
      }
    } catch (e) {
      logger.error('AI score xatolik:', e);
      await ctx.reply('❌ Ball olishda xatolik');
    }
  });
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return '🌟';
  if (score >= 70) return '👍';
  if (score >= 50) return '😐';
  if (score >= 30) return '⚠️';
  return '🚨';
}
