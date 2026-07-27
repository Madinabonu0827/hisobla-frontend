import { Telegraf } from 'telegraf';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function voiceHandler(bot: Telegraf) {
  bot.command('voice', async (ctx) => {
    await ctx.reply(
      '🎙 *Ovozli kiritish*\n\n' +
      'Telegram da ovozli xabar yuboring!\n\n' +
      'Misol:\n' +
      '• "Bugun ovqat uchun 50 ming ishlatdim"\n' +
      '• "Taxi uchun 35 ming"\n' +
      '• "Maosh oldim 7 million"\n' +
      '• "Uy uchun kommunal 200 ming"\n\n' +
      '_AI avtomatik aniqlab, tranzaksiya qo\'shadi_',
      { parse_mode: 'Markdown' }
    );
  });

  bot.on('voice', async (ctx) => {
    await ctx.reply('🎤 Ovozli xabar qabul qilindi. Qayta ishlanmoqda...');

    try {
      const file = await ctx.telegram.getFile(ctx.message.voice.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

      const res = await fetch(`${API_BASE}/api/voice/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: ctx.from.id,
          fileUrl,
          fileId: ctx.message.voice.file_id,
        }),
      });
      const data: any = await res.json();

      if (data.success) {
        const r = data.data;
        let msg = `✅ *Ovoz qayta ishlandi:*\n\n`;
        msg += `📝 Matn: "${r.text}"\n\n`;
        msg += `💰 Miqdor: ${r.amount?.toLocaleString() || 'Aniqlanmadi'} so'm\n`;
        msg += `📂 Kategoriya: ${r.category || 'Boshqa'}\n`;
        msg += `📊 Turi: ${r.type === 'INCOME' ? '💵 Daromad' : '💸 Xarajat'}\n`;

        if (r.confidence >= 0.7) {
          msg += `\n✅ *Tranzaksiya saqlandi!*`;
        } else {
          msg += `\n❓ *Ishtirokchini tasdiqlaysizmi?*\n`;
        }

        await ctx.reply(msg, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Tasdiqlash', callback_data: `voice_confirm_${r.id || 'new'}` },
                { text: '❌ Bekor qilish', callback_data: 'voice_cancel' },
              ],
            ],
          },
        });
      } else {
        await ctx.reply('❌ Ovozni qayta ishlashda xatolik. Qaytadan urinib ko\'ring.');
      }
    } catch (e) {
      logger.error('Voice xatolik:', e);
      await ctx.reply('❌ Ovoz qayta ishlashda xatolik');
    }
  });

  bot.on('video_note', async (ctx) => {
    await ctx.reply(
      '🎥 Video xabar qabul qilindi.\n\nHozircha faqat ovozli xabarlar qo\'llab-quvvatlanadi.\n/voice buyrug\'ini ishlating yoki ovozli xabar yuboring.',
    );
  });

  bot.action(/voice_confirm_(.+)/, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('✅ Tranzaksiya tasdiqlandi!');
  });

  bot.action('voice_cancel', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('❌ Tranzaksiya bekor qilindi.');
  });
}
