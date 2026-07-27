export declare function formatCurrency(amount: number, currency?: string): string;
export declare function formatCompactCurrency(amount: number): string;
export declare function getCurrentMonth(): {
    month: string;
    year: number;
};
export declare function getMonthKey(date?: Date): string;
export declare function getWeekNumber(date?: Date): number;
export declare function calculatePercentage(value: number, total: number): number;
export declare function generateId(): string;
export declare function sleep(ms: number): Promise<void>;
export declare function chunkArray<T>(array: T[], size: number): T[][];
export declare function parseAmountFromText(text: string): number | null;
export declare function detectCategoryFromText(text: string): {
    category: string;
    type: 'INCOME' | 'EXPENSE';
} | null;
export declare function detectPaymentMethod(text: string): string | undefined;
