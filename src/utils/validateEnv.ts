/**
 * Environment Variable Validator
 * Validates environment variables at application startup
 */
import { logger } from "@/utils/logger";

interface EnvValidationError {
  variable: string;
  reason: string;
}

/**
 * Validates public client environment variables
 */
export function validateEnv(): void {
  const errors: EnvValidationError[] = [];

  // Note: Private secrets (GEMINI_API_KEY) are processed exclusively server-side.
  // Optional client persistence variables:
  const optional = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const warnings: string[] = [];

  for (const key of optional) {
    const value = import.meta.env[key] as string | undefined;
    if (!value || (typeof value === 'string' && value.includes('your_'))) {
      warnings.push(key);
    }
  }

  // Log warnings for optional variables
  if (warnings.length > 0 && import.meta.env.DEV) {
    logger.warn(
      `Optional environment variables not configured: ${warnings.join(', ')}. ` +
      'Persistence features may run in local-only mode.'
    );
  }

  // Handle errors if any required public variables fail validation
  if (errors.length > 0) {
    const errorMessage = errors
      .map(e => `  • ${e.variable}: ${e.reason}`)
      .join('\n');

    logger.error(
      'Environment Validation Failed:\n' +
      errorMessage +
      '\n\nPlease update your environment file.'
    );

    throw new Error(`Missing or invalid environment variables:\n${errorMessage}`);
  }

  if (import.meta.env.DEV) {
    logger.info('Environment variables validated successfully');
  }
}

export function getEnvMode(): 'development' | 'production' | 'test' {
  if (import.meta.env.MODE === 'test') { return 'test'; }
  if (import.meta.env.PROD) { return 'production'; }
  return 'development';
}

export function isDevelopment(): boolean {
  return getEnvMode() === 'development';
}

export function isProduction(): boolean {
  return getEnvMode() === 'production';
}

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] as string | undefined;

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
}
