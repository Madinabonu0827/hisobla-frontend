import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';

const AI_SYSTEM_PROMPT = `Sen professional moliyaviy maslahatchisan. Sening vazifang:
- Foydalanuvchining moliyaviy holatini tahlil qilish
- Xarajatlar tuzilishini yaxshilash bo'yicha maslahatlar berish
- Tejamkorlik strategiyalarini taklif qilish
- Byudjet boshqaruviga yordam berish
- Kelajak uchun moliyaviy prognozlar berish

Javoblaring professional, aniq va foydali bo'lishi kerak.
Har doim konkret raqamlar va misollar keltir.
Foydalanuvchi tilida (o'zbek) javob ber.`;

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your_openai_api_key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async getAdvice(telegramId: number) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
    });

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    const expensesByCategory = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topExpenses = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    let score = 50;
    if (totalIncome > 0) {
      if (savingsRate >= 30) score = 90;
      else if (savingsRate >= 20) score = 80;
      else if (savingsRate >= 10) score = 70;
      else if (savingsRate >= 0) score = 60;
      else if (savingsRate >= -10) score = 40;
      else score = 20;
    }

    let tips: string[] = [];
    let warnings: string[] = [];
    let forecast = '';

    if (savings < 0) {
      warnings.push(`Bu oy ${Math.abs(savings).toLocaleString()} so'm kamchilik bor!`);
      tips.push('Keraksiz xarajatlarni kamaytiring');
      tips.push('Kredit kartangizdan ehtiyot bo\'ling');
      tips.push('Oziq-ovqat xarajatlarini nazorat qiling');
      forecast = 'Agar shu davom etsangiz, keyingi oyda moliyaviy qiyinchiliklar bo\'lishi mumkin.';
    } else {
      if (savingsRate < 20) {
        tips.push('Tejamkorlikni 20% ga yetkazishga harakat qiling');
        tips.push('Qo\'shimcha daromad manbai topishga harakat qiling');
      } else if (savingsRate < 50) {
        tips.push('Yaxshi natija! Lekin yana ko\'proq tejashga harakat qiling');
        tips.push('Investitsiya qilishni boshlang');
      } else {
        tips.push('Ajoyib! Siz juda yaxshi tejayapsiz');
        tips.push('Emergency fond yarating');
        tips.push('Uzoq muddatli investitsiyalarni ko\'rib chiqing');
      }
      forecast = `Agar shu temdda davom etsangiz, yil oxiriga ${savings * 12} so'm tejash mumkin.`;
    }

    return {
      score,
      summary: savings >= 0
        ? `Bu oy ${savings.toLocaleString()} so'm tejamkorlik qildingiz (${savingsRate.toFixed(1)}%).`
        : `Bu oy ${Math.abs(savings).toLocaleString()} so'm kamchilik bor.`,
      tips,
      warnings,
      forecast,
      topExpenses,
      totalIncome,
      totalExpense,
      savings,
      savingsRate,
    };
  }

  async chat(telegramId: number, message: string) {
    if (!this.openai) {
      return { response: 'AI funksiyasi hozircha mavjud emas. OpenAI API key sozlang.' };
    }

    const user = await this.prisma.user.findUnique({
      where: { telegramId: String(telegramId) },
    });
    if (!user) throw new Error('User not found');

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: 'desc' },
      take: 50,
    });

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const context = `Foydalanuvchi moliyaviy holati:
- Oylik daromad: ${totalIncome.toLocaleString()} so'm
- Oylik xarajat: ${totalExpense.toLocaleString()} so'm
- Balans: ${(totalIncome - totalExpense).toLocaleString()} so'm
- Tranzaksiyalar soni: ${transactions.length}

Oxirgi tranzaksiyalar:
${transactions.slice(0, 10).map(t => `- ${t.type === 'INCOME' ? 'Daromad' : 'Xarajat'}: ${t.amount.toLocaleString()} so'm (${t.category}) - ${t.description || ''}`).join('\n')}

Foydalanuvchi savoli: ${message}`;

    const completion = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: context },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content || 'Javob olishda xatolik';

    await this.prisma.aIConversation.createMany({
      data: [
        { userId: user.id, role: 'USER', content: message, tokens: completion.usage?.prompt_tokens || 0 },
        { userId: user.id, role: 'ASSISTANT', content: response, tokens: completion.usage?.completion_tokens || 0 },
      ],
    });

    return { response };
  }

  async getScore(telegramId: number) {
    const advice = await this.getAdvice(telegramId);
    return { score: advice.score };
  }
}
