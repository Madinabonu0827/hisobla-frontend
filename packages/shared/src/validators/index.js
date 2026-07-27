"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAmount = validateAmount;
exports.validateCategory = validateCategory;
exports.validateDate = validateDate;
exports.validateTelegramId = validateTelegramId;
exports.sanitizeInput = sanitizeInput;
exports.validateBudgetLimit = validateBudgetLimit;
function validateAmount(amount) {
    if (amount === undefined || amount === null) {
        return { valid: false, error: 'Miqdor kiritilishi shart' };
    }
    const num = Number(amount);
    if (isNaN(num)) {
        return { valid: false, error: 'Miqdor raqam bo\'lishi kerak' };
    }
    if (num <= 0) {
        return { valid: false, error: 'Miqdor 0 dan katta bo\'lishi kerak' };
    }
    if (num > 999_999_999_999) {
        return { valid: false, error: 'Miqdor juda katta' };
    }
    return { valid: true };
}
function validateCategory(category) {
    if (!category || typeof category !== 'string') {
        return { valid: false, error: 'Kategoriya kiritilishi shart' };
    }
    if (category.length < 2 || category.length > 50) {
        return { valid: false, error: 'Kategoriya nomi 2-50 belgi orasida bo\'lishi kerak' };
    }
    return { valid: true };
}
function validateDate(date) {
    if (!date)
        return { valid: true };
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return { valid: false, error: 'Noto\'g\'ri sana formati' };
    }
    if (d > new Date()) {
        return { valid: false, error: 'Sana kelajakda bo\'lishi mumkin emas' };
    }
    return { valid: true };
}
function validateTelegramId(id) {
    if (!id) {
        return { valid: false, error: 'Telegram ID kiritilishi shart' };
    }
    if (typeof id !== 'number' && typeof id !== 'string') {
        return { valid: false, error: 'Telegram ID raqam bo\'lishi kerak' };
    }
    return { valid: true };
}
function sanitizeInput(input) {
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .trim();
}
function validateBudgetLimit(limit) {
    if (limit === undefined || limit === null) {
        return { valid: false, error: 'Limit kiritilishi shart' };
    }
    const num = Number(limit);
    if (isNaN(num) || num <= 0) {
        return { valid: false, error: 'Limit musbat raqam bo\'lishi kerak' };
    }
    if (num > 999_999_999_999) {
        return { valid: false, error: 'Limit juda katta' };
    }
    return { valid: true };
}
//# sourceMappingURL=index.js.map