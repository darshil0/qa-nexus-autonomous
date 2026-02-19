/**
 * Environment Variable Validator
 * Validates required environment variables at application startup
 */
import { logger } from "@/utils/logger";

interface EnvValidationError {
  variable: string;
  reason: string;
}

/**
 * Validates all required environment variables
 * @throws {Error} If any required variables are missing or invalid
 */
export function validateEnv(): void {
  const errors: EnvValidationError[] = [];

  // Required variables
  const required = ['VITE_GEMINI_API_KEY'];

  for (const key of required) {
    const value = import.meta.env[key] as string | undefined;

    if (!value) {
      errors.push({
        variable: key,
        reason: 'Missing or empty'
      });
    } else if (value === 'your_gemini_api_key_here' || value === 'your_api_key_here') {
      errors.push({
        variable: key,
        reason: 'Still using placeholder value'
      });
    } else if (value.length < 10) {
      errors.push({
        variable: key,
        reason: 'Value too short (likely invalid)'
      });
    }
  }

  // Optional but recommended variables
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
      'Some features may not work properly.'
    );
  }

  // Handle errors
  if (errors.length > 0) {
    const errorMessage = errors
      .map(e => `  • ${e.variable}: ${e.reason}`)
      .join('\n');

    logger.error(
      'Environment Validation Failed:\n' +
      errorMessage +
      '\n\nPlease update your .env file with valid credentials.'
    );

    // Show user-friendly error in development
    if (import.meta.env.DEV) {
      showEnvError(errors);
    }

    throw new Error(
      `Missing or invalid environment variables:\n${errorMessage}\n\n` +
      'Please create a .env file in the project root with your API keys. ' +
      'See .env.example for reference.'
    );
  }

  // Success
  if (import.meta.env.DEV) {
    logger.info('Environment variables validated successfully');
  }
}

/**
 * Displays a user-friendly error page for environment configuration issues
 */
function showEnvError(errors: EnvValidationError[]): void {
  const errorList = errors
    .map(e => `<li><code>${e.variable}</code>: ${e.reason}</li>`)
    .join('');

  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
    ">
      <div style="
        max-width: 700px;
        padding: 2.5rem;
        background: rgba(244, 63, 94, 0.1);
        border: 2px solid #f43f5e;
        border-radius: 1rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      ">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h1 style="color: #f43f5e; margin: 0; font-size: 1.75rem; font-weight: 700;">
            Configuration Error
          </h1>
        </div>

        <p style="margin-bottom: 1.5rem; color: #cbd5e1; line-height: 1.6;">
          QA Nexus Autonomous requires valid environment variables to function.
          The following issues were detected:
        </p>

        <ul style="
          margin: 1.5rem 0;
          padding-left: 1.5rem;
          color: #f8fafc;
          line-height: 1.8;
        ">
          ${errorList}
        </ul>

        <div style="
          margin: 2rem 0;
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 0.75rem;
          border-left: 3px solid #6366f1;
        ">
          <h3 style="
            color: #6366f1;
            margin: 0 0 0.75rem 0;
            font-size: 0.875rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            How to fix this:
          </h3>
          <ol style="margin: 0; padding-left: 1.5rem; color: #cbd5e1; line-height: 1.8;">
            <li>Create a <code style="background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">.env</code> file in the project root</li>
            <li>Copy the contents from <code style="background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">.env.example</code></li>
            <li>Replace placeholder values with your actual API keys</li>
            <li>Restart the development server: <code style="background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: 0.25rem;">npm run dev</code></li>
          </ol>
        </div>

        <div style="
          padding: 1rem;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 0.5rem;
          border: 1px solid rgba(99, 102, 241, 0.3);
        ">
          <p style="margin: 0; font-size: 0.875rem; color: #a5b4fc; line-height: 1.6;">
            <strong style="color: #818cf8;">📚 Need help?</strong><br>
            Get your Gemini API key from:
            <a href="https://aistudio.google.com" target="_blank" rel="noopener" style="color: #6366f1; text-decoration: underline;">
              https://aistudio.google.com
            </a>
          </p>
        </div>

        <p style="
          margin-top: 2rem;
          font-size: 0.75rem;
          color: #64748b;
          text-align: center;
        ">
          See <code>README.md</code> for detailed setup instructions
        </p>
      </div>
    </div>
  `;
}

/**
 * Get environment mode
 */
export function getEnvMode(): 'development' | 'production' | 'test' {
  if (import.meta.env.MODE === 'test') {return 'test';}
  if (import.meta.env.PROD) {return 'production';}
  return 'development';
}

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvMode() === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return getEnvMode() === 'production';
}

/**
 * Get environment variable with type safety
 */
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
