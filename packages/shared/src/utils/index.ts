export function formatCurrency(amount: number, currency: string = 'UZS'): string {
  const formatted = new Intl.NumberFormat('uz-UZ').format(amount);
  switch (currency) {
    case 'UZS': return `${formatted} so'm`;
    case 'USD': return `$${formatted}`;
    case 'EUR': return `€${formatted}`;
    case 'RUB': return `₽${formatted}`;
    default: return `${formatted} ${currency}`;
  }
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toString();
}

export function getCurrentMonth(): { month: string; year: number } {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1).padStart(2, '0'),
    year: now.getFullYear(),
  };
}

export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function parseAmountFromText(text: string): number | null {
  const patterns = [
    /(\d+[\s.]?\d*)\s*(ming|mln|miiion|milliard|k|k|m|b)/i,
    /(\d+[\s.]?\d*)\s*(so'm|soum|sum)/i,
    /(\d{1,3}(?:\s?\d{3})*)/,
    /(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let amount = parseFloat(match[1].replace(/[\s.]/g, ''));
      
      if (match[2]) {
        const multiplier = match[2].toLowerCase();
        if (['ming', 'k'].includes(multiplier)) amount *= 1000;
        else if (['mln', 'million', 'm'].includes(multiplier)) amount *= 1_000_000;
        else if (['milliard', 'b'].includes(multiplier)) amount *= 1_000_000_000;
      }
      
      return amount;
    }
  }
  
  return null;
}

export function detectCategoryFromText(text: string): { category: string; type: 'INCOME' | 'EXPENSE' } | null {
  const lower = text.toLowerCase();
  
  const expenseKeywords: Record<string, string[]> = {
    food: ['ovqat', 'tamaddi', 'nonushta', 'tushlik', 'kechki', 'yemoq', 'meymoq', 'restoran', 'cafe', 'kofe', 'chai', 'choy'],
    transport: ['taxi', 'uber', 'yol', 'benzin', 'yoqilg\'i', 'avtobus', 'metro', 'poyezd', 'samolyot'],
    shopping: ['xarid', 'do\'kon', 'magazin', 'olish', 'sotib'],
    bills: ['kommunal', 'svet', 'gaz', 'suv', 'internet', 'telefon', 'uy-joy'],
    entertainment: ['kinoteatr', 'konsert', 'o\'yin', 'football', 'sport', 'dam olish'],
    health: ['dorixon', 'shifokor', 'kasalxona', 'dori', 'tibbiyot'],
    education: ['kitob', 'kurs', 'ta\'lim', 'o\'qish', 'maktab'],
    clothing: ['kiyim', 'poyabzal', 'kurtka', 'shim'],
    gifts: ['sovg\'a', 'tug\'ilgan kun', 'nikoh'],
    investment: ['investitsiya', 'depozit', 'aktsiya', 'kripto'],
  };

  const incomeKeywords: Record<string, string[]> = {
    salary: ['oylik', 'maosh', 'ish haqi', 'isplozha'],
    business: ['biznes', 'sotish', 'sotuv', 'foyda', 'daromad'],
    freelance: ['freelance', 'frilans', 'order', 'topshiriq'],
    gift_income: ['sovg\'a', 'tu\'y', 'hadya'],
    investment_income: ['foyda', 'dividend', 'foiz', 'depozit'],
  };

  for (const [category, keywords] of Object.entries(expenseKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return { category, type: 'EXPENSE' };
      }
    }
  }

  for (const [category, keywords] of Object.entries(incomeKeywords)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return { category, type: 'INCOME' };
      }
    }
  }

  return null;
}

export function detectPaymentMethod(text: string): string | undefined {
  const lower = text.toLowerCase();
  const methods: Record<string, string[]> = {
    cash: ['naqd', 'cash', 'pul'],
    uzcard: ['uzcard', 'uz card'],
    humo: ['humo'],
    visa: ['visa'],
    mastercard: ['mastercard', 'master'],
    payme: ['payme', 'payme'],
    click: ['click'],
  };

  for (const [method, keywords] of Object.entries(methods)) {
    if (keywords.some(kw => lower.includes(kw))) return method;
  }
  return undefined;
}
