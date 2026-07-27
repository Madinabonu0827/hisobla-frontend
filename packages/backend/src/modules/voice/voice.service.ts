import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';
import axios from 'axios';

function parseAmountFromText(text: string): number | null {
  const patterns = [
    /(\d+[\s.]?\d*)\s*(ming|mln|million|milliard|k|m|b)/i,
    /(\d+[\s.]?\d*)\s*(so'm|soum|sum)/i,
    /(\d{1,3}(?:\s?\d{3})*)/,
    /(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let amount = parseFloat(match[1].replace(/[\s.]/g, ''));
      if (match[2]) {
        const m = match[2].toLowerCase();
        if (['ming', 'k'].includes(m)) amount *= 1000;
        else if (['mln', 'million', 'm'].includes(m)) amount *= 1_000_000;
        else if (['milliard', 'b'].includes(m)) amount *= 1_000_000_000;
      }
      return amount;
    }
  }
  return null;
}

function detectCategoryFromText(text: string): { category: string; type: 'INCOME' | 'EXPENSE' } | null {
  const lower = text.toLowerCase();
  const expenseMap: Record<string, string[]> = {
    food: ['ovqat', 'tamaddi', 'nonushta', 'tushlik', 'kechki', 'restoran', 'cafe'],
    transport: ['taxi', 'uber', 'benzin', 'yoqilg\'i', 'avtobus'],
    bills: ['kommunal', 'svet', 'gaz', 'suv', 'internet', 'telefon'],
    shopping: ['xarid', 'do\'kon', 'magazin', 'sotib'],
    entertainment: ['kinoteatr', 'konsert', 'o\'yin', 'football'],
    health: ['dorixon', 'shifokor', 'kasalxona', 'dori'],
  };
  const incomeMap: Record<string, string[]> = {
    salary: ['oylik', 'maosh', 'ish haqi'],
    business: ['biznes', 'sotish', 'foyda'],
    freelance: ['freelance', 'frilans'],
  };
  for (const [cat, kws] of Object.entries(expenseMap)) {
    if (kws.some(k => lower.includes(k))) return { category: cat, type: 'EXPENSE' };
  }
  for (const [cat, kws] of Object.entries(incomeMap)) {
    if (kws.some(k => lower.includes(k))) return { category: cat, type: 'INCOME' };
  }
  return null;
}

@Injectable()
export class VoiceService {
  constructor(
    private prisma: PrismaService,
    private transactionsService: TransactionsService,
  ) {}

  async processVoice(telegramId: number, fileUrl: string) {
    let text = '';

    try {
      const firefliesKey = process.env.FIREFLIES_API_KEY;
      if (firefliesKey && firefliesKey !== 'your_fireflies_api_key') {
        const response = await axios.post(
          `${process.env.FIREFLIES_API_URL || 'https://api.fireflies.ai/v1'}/transcriptions`,
          { audioUrl: fileUrl, language: 'uz' },
          {
            headers: {
              'Authorization': `Bearer ${firefliesKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
        text = response.data?.text || '';
      }
    } catch {
      // Fireflies mavjud emas, fallback ishlatiladi
    }

    if (!text) {
      return {
        text: 'Ovoz transkripsiyasi mavjud emas',
        amount: undefined,
        category: undefined,
        type: undefined,
        confidence: 0,
        needsManualInput: true,
      };
    }

    const amount = parseAmountFromText(text);
    const detected = detectCategoryFromText(text);

    return {
      text,
      amount,
      category: detected?.category || 'other_expense',
      type: detected?.type || 'EXPENSE',
      confidence: amount && detected ? 0.85 : 0.5,
      needsManualInput: false,
    };
  }

  async confirmVoiceTransaction(telegramId: number, data: {
    amount: number;
    category: string;
    type: 'INCOME' | 'EXPENSE';
    description?: string;
  }) {
    return this.transactionsService.create({
      telegramId,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      source: 'VOICE',
    });
  }
}
