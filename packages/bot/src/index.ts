import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { setupHandlers } from './handlers';
import { setupMiddleware } from './middleware';
import { setupCronJobs } from './services/cron';
import { logger } from './utils/logger';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:3000';
const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

async function waitForBackend(maxRetries = 30, delayMs = 2000): Promise<void> {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch(`${API_BASE}/api/users/stats`);
      if (res.ok) {
        logger.info('✅ Backend bilan bog\'lanish o\'rnatildi');
        return;
      }
    } catch {
      // backend hali tayyor emas
    }
    logger.info(`⏳ Backend kutilmoqda... (${i}/${maxRetries})`);
    await new Promise(r => setTimeout(r, delayMs));
  }
  logger.warn('⚠️ Backend hali tayyor emas, bot ishga tushdi lekin API xatolari mumkin');
}

async function main() {
  logger.info('🤖 Bot ishga tushmoqda...');

  await waitForBackend();

  const bot = new Telegraf(BOT_TOKEN, {
    handlerTimeout: 60_000,
  });

  setupMiddleware(bot);
  setupHandlers(bot, WEBAPP_URL);

  bot.catch((err: any, ctx) => {
    logger.error(`Bot xatoligi: ${err.message}`, { chatId: ctx.chat?.id });
  });

  setupCronJobs(bot);

  await bot.launch();
  logger.info('✅ Bot muvaffaqiyatli ishga tushdi!');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch((err) => {
  logger.error('Bot ishga tushmadi:', err);
  process.exit(1);
});
