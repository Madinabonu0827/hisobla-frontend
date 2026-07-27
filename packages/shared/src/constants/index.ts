export const CATEGORIES = {
  EXPENSE: [
    { id: 'food', name: 'Ovqat', icon: '🍔', color: '#ff6b6b' },
    { id: 'shopping', name: 'Xarid', icon: '🛍️', color: '#a855f7' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#4ecdc4' },
    { id: 'education', name: 'Ta\'lim', icon: '📚', color: '#3b82f6' },
    { id: 'bills', name: 'Kommunal', icon: '🏠', color: '#f59e0b' },
    { id: 'entertainment', name: 'Ko\'ngil', icon: '🎮', color: '#ec4899' },
    { id: 'health', name: 'Salomatlik', icon: '🏥', color: '#10b981' },
    { id: 'travel', name: 'Sayohat', icon: '✈️', color: '#06b6d4' },
    { id: 'investment', name: 'Investitsiya', icon: '📈', color: '#8b5cf6' },
    { id: 'clothing', name: 'Kiyim', icon: '👕', color: '#f97316' },
    { id: 'gifts', name: 'Sovg\'alar', icon: '🎁', color: '#e11d48' },
    { id: 'other_expense', name: 'Boshqa', icon: '📦', color: '#6b7280' },
  ],
  INCOME: [
    { id: 'salary', name: 'Oylik', icon: '💵', color: '#00d68f' },
    { id: 'business', name: 'Biznes', icon: '🏢', color: '#3b82f6' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#8b5cf6' },
    { id: 'gift_income', name: 'Sovga', icon: '🎁', color: '#ec4899' },
    { id: 'investment_income', name: 'Investitsiya', icon: '📈', color: '#f59e0b' },
    { id: 'other_income', name: 'Boshqa', icon: '💰', color: '#6b7280' },
  ],
};

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Naqd', icon: '💵' },
  { id: 'uzcard', name: 'UzCard', icon: '💳' },
  { id: 'humo', name: 'Humo', icon: '💳' },
  { id: 'visa', name: 'Visa', icon: '💳' },
  { id: 'mastercard', name: 'Mastercard', icon: '💳' },
  { id: 'payme', name: 'Payme', icon: '📱' },
  { id: 'click', name: 'Click', icon: '📱' },
  { id: 'transfer', name: 'O\'tkazma', icon: '🔄' },
  { id: 'other', name: 'Boshqa', icon: '❓' },
];

export const CURRENCIES = [
  { code: 'UZS', symbol: 'so\'m', name: 'O\'zbek so\'mi' },
  { code: 'USD', symbol: '$', name: 'AQSh dollari' },
  { code: 'EUR', symbol: '€', name: 'Yevro' },
  { code: 'RUB', symbol: '₽', name: 'Rossiya rubli' },
];

export const WELCOME_MESSAGE = `💰 *Assalomu alaykum!*

Bot shaxsiy moliyaviy yordamchingizga xush kelibsiz.

Bu bot sizning kundalik daromad va xarajatlaringizni boshqarishga yordam beradi.

*Imkoniyatlar:*

✨ Xarajatlarni yozish
💵 Daromadlarni yozish
📊 Statistikalar
📈 Grafiklar
🎯 Byudjet
🤖 AI maslahat
🎙 Ovoz orqali xarajat qo'shish
📱 Telegram Mini App`;

export const HELP_MESSAGE = `📚 *Buyruqlar ro'yxati:*

/start - Botni ishga tushirish
/balance - Balansni ko'rish
/add - Xarajat qo'shish
/income - Daromad qo'shish
/stats - Oylik statistika
/budget - Byudjet boshqaruvi
/goals - Moliyaviy maqsadlar
/advice - AI maslahat
/voice - Ovozli kiritish
/history - Tarix
/report - Hisobot
/settings - Sozlamalar
/help - Yordam`;

export const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

export const AI_SYSTEM_PROMPT = `Sen professional moliyaviy maslahatchisan. Sening vazifang:
- Foydalanuvchining moliyaviy holatini tahlil qilish
- Xarajatlar tuzilishini yaxshilash bo'yicha maslahatlar berish
- Tejamkorlik strategiyalarini taklif qilish
- Byudjet boshqaruviga yordam berish
- Kelajak uchun moliyaviy prognozlar berish

Javoblaring professional, aniq va foydali bo'lishi kerak.
Har doim konkret raqamlar va misollar keltir.
Foydalanuvchi tilida (o'zbek) javob ber.

Moliyaviy ball tizimi:
- 90-100: Ajoyib - juda yaxshi moliyaviy boshqaruv
- 70-89: Yaxshi - yaxshi, lekin yaxshilash mumkin
- 50-69: O'rtacha - bir oz ehtiyot bo'lish kerak
- 30-25: Yomon - jiddiy o'zgarishlar kerak
- 0-29: Juda yomon - tezda choralar ko'rish kerak`;
