import { Telegraf, Context } from 'telegraf';
import { logger } from '../utils/logger';

export function setupMiddleware(bot: Telegraf) {
  bot.use(async (ctx: Context, next) => {
    const start = Date.now();

    if (ctx.from) {
      const msgType = ctx.message ? 'message' : ctx.callbackQuery ? 'callback' : ctx.updateType;
      logger.debug(`[${ctx.from.id}] ${ctx.from.first_name || ''} - ${msgType}`);
    }

    await next();

    const ms = Date.now() - start;
    if (ms > 1000) {
      logger.warn(`Slow response: ${ms}ms`, { chatId: ctx.chat?.id });
    }
  });

  bot.use(async (ctx: Context, next) => {
    try {
      await next();
    } catch (err: any) {
      logger.error(`Handler xatoligi: ${err.message}`, {
        chatId: ctx.chat?.id,
        updateType: ctx.updateType,
        stack: err.stack,
      });

      try {
        await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      } catch {}
    }
  });
}
