import { Telegraf } from 'telegraf';
import cron from 'node-cron';
import { logger } from '../utils/logger';

const API_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

export function setupCronJobs(bot: Telegraf) {
  cron.schedule('0 9 * * *', async () => {
    logger.info('🔔 Daily reminder cron triggered');
    try {
      const res = await fetch(`${API_BASE}/api/notifications/daily-reminder`);
      const data: any = await res.json();

      if (data.success && data.data?.users) {
        for (const user of data.data.users) {
          try {
            await bot.telegram.sendMessage(
              user.telegramId,
              `🌅 *Assalomu alaykum, ${user.firstName || 'Foydalanuvchi'}!*\n\nBugungi eslatma:\n📊 Balansingizni tekshiring\n🎯 Byudjetingizni nazorat qiling`,
              { parse_mode: 'Markdown' }
            );
          } catch (e: any) {
            logger.warn(`Daily reminder yuborilmadi [${user.telegramId}]: ${e.message}`);
          }
        }
      }
    } catch (e) {
      logger.error('Daily reminder xatolik:', e);
    }
  });

  cron.schedule('0 21 * * 0', async () => {
    logger.info('📊 Weekly summary cron triggered');
    try {
      const res = await fetch(`${API_BASE}/api/notifications/weekly-summary`);
      const data: any = await res.json();

      if (data.success && data.data?.users) {
        for (const user of data.data.users) {
          try {
            await bot.telegram.sendMessage(
              user.telegramId,
              `📊 *Haftalik hisobot*\n\n` +
              `💵 Daromad: ${user.weeklyIncome?.toLocaleString() || 0} so'm\n` +
              `💸 Xarajat: ${user.weeklyExpense?.toLocaleString() || 0} so'm\n` +
              `💰 Tejamkorlik: ${user.weeklySavings?.toLocaleString() || 0} so'm`,
              { parse_mode: 'Markdown' }
            );
          } catch (e: any) {
            logger.warn(`Weekly summary yuborilmadi [${user.telegramId}]: ${e.message}`);
          }
        }
      }
    } catch (e) {
      logger.error('Weekly summary xatolik:', e);
    }
  });

  cron.schedule('0 10 1 * *', async () => {
    logger.info('📅 Monthly report cron triggered');
    try {
      const res = await fetch(`${API_BASE}/api/notifications/monthly-report`);
      const data: any = await res.json();

      if (data.success && data.data?.users) {
        for (const user of data.data.users) {
          try {
            await bot.telegram.sendMessage(
              user.telegramId,
              `📅 *Oylik hisobot tayyor!*\n\nBatafsil Mini App da ko'rishingiz mumkin.`,
              {
                parse_mode: 'Markdown',
                reply_markup: {
                  inline_keyboard: [
                    [{ text: '📊 Hisobotni ko\'rish', web_app: { url: process.env.WEBAPP_URL || 'http://localhost:3000' } }],
                  ],
                },
              }
            );
          } catch (e: any) {
            logger.warn(`Monthly report yuborilmadi [${user.telegramId}]: ${e.message}`);
          }
        }
      }
    } catch (e) {
      logger.error('Monthly report xatolik:', e);
    }
  });

  logger.info('⏰ Cron jobs o\'rnatildi');
}
