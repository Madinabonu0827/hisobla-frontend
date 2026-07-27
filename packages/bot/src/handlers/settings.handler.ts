import { Telegraf } from 'telegraf';

export function settingsHandler(bot: Telegraf) {
  bot.command('settings', async (ctx) => {
    await ctx.reply(
      '⚙️ *Sozlamalar*\n\n' +
      '🌙 *Tungi rejim:* Mini App da mavjud\n' +
      '🔔 *Bildirishnomalar:* Yoqilgan\n' +
      '💱 *Valyuta:* UZS (O\'zbek so\'mi)\n' +
      '🌐 *Til:* O\'zbek\n\n' +
      '_Batafsil sozlamalar Mini App da_',
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚀 Mini App ni ochish', web_app: { url: process.env.WEBAPP_URL || 'http://localhost:3000' } }],
          ],
        },
      }
    );
  });
}
