const levels = { error: 0, warn: 1, info: 2, debug: 3 };

function formatMessage(level: string, message: string, meta?: any): string {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  error: (message: string, meta?: any) => console.error(formatMessage('error', message, meta)),
  warn: (message: string, meta?: any) => console.warn(formatMessage('warn', message, meta)),
  info: (message: string, meta?: any) => console.log(formatMessage('info', message, meta)),
  debug: (message: string, meta?: any) => console.log(formatMessage('debug', message, meta)),
};
