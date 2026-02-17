/**
 * Centralized logging utility to ensure consistent log formats
 * and comply with linting rules.
 */
const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[${getTimestamp()}] [INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[${getTimestamp()}] [WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[${getTimestamp()}] [ERROR] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[${getTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  }
};
