import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'UZS'): string {
  const formatted = new Intl.NumberFormat('uz-UZ').format(amount);
  if (currency === 'UZS') return `${formatted} so'm`;
  if (currency === 'USD') return `$${formatted}`;
  return `${formatted} ${currency}`;
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toString();
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMonthName(month: number): string {
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ];
  return months[month] || '';
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: '🍔', shopping: '🛍️', transport: '🚗', education: '📚',
    bills: '🏠', entertainment: '🎮', health: '🏥', travel: '✈️',
    investment: '📈', clothing: '👕', gifts: '🎁', other_expense: '📦',
    salary: '💵', business: '🏢', freelance: '💻', gift_income: '🎁',
    investment_income: '📈', other_income: '💰',
  };
  return icons[category] || '📦';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    food: '#ff6b6b', shopping: '#a855f7', transport: '#4ecdc4',
    education: '#3b82f6', bills: '#f59e0b', entertainment: '#ec4899',
    health: '#10b981', travel: '#06b6d4', investment: '#8b5cf6',
    clothing: '#f97316', gifts: '#e11d48', other_expense: '#6b7280',
    salary: '#00d68f', business: '#3b82f6', freelance: '#8b5cf6',
    gift_income: '#ec4899', investment_income: '#f59e0b', other_income: '#6b7280',
  };
  return colors[category] || '#6b7280';
}
