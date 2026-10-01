import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateEnv,
  getEnvMode,
  isDevelopment,
  isProduction,
  getEnvVar
} from '@/utils/validateEnv';

describe('validateEnv', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    document.body.innerHTML = '';
  });

  it('validates successfully when required env vars are valid', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'valid_api_key_123456');
    expect(() => validateEnv()).not.toThrow();
  });

  it('throws error and renders UI when required env var is missing', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    vi.stubEnv('DEV', true);

    expect(() => validateEnv()).toThrow(/Missing or invalid environment variables/);
    const rootElement = document.getElementById('root');
    expect(rootElement?.innerHTML).toContain('Configuration Error');
  });

  it('throws error when required env var uses placeholder value', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'your_gemini_api_key_here');
    vi.stubEnv('DEV', true);

    expect(() => validateEnv()).toThrow(/Still using placeholder value/);
  });

  it('throws error when required env var is too short', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'short');
    vi.stubEnv('DEV', true);

    expect(() => validateEnv()).toThrow(/Value too short/);
  });

  it('logs warnings for optional missing env vars in dev mode', () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'valid_api_key_123456');
    vi.stubEnv('VITE_SUPABASE_URL', 'your_supabase_url');
    vi.stubEnv('DEV', true);

    expect(() => validateEnv()).not.toThrow();
  });

  it('getEnvMode returns correct mode', () => {
    vi.stubEnv('MODE', 'test');
    expect(getEnvMode()).toBe('test');

    vi.stubEnv('MODE', 'production');
    vi.stubEnv('PROD', true);
    expect(getEnvMode()).toBe('production');

    vi.stubEnv('MODE', 'development');
    vi.stubEnv('PROD', false);
    expect(getEnvMode()).toBe('development');
  });

  it('isDevelopment and isProduction helpers work correctly', () => {
    vi.stubEnv('MODE', 'development');
    vi.stubEnv('PROD', false);
    expect(isDevelopment()).toBe(true);

    vi.stubEnv('MODE', 'production');
    vi.stubEnv('PROD', true);
    expect(isProduction()).toBe(true);
  });

  it('getEnvVar returns value or default value, or throws if missing', () => {
    vi.stubEnv('VITE_TEST_VAR', 'hello');
    expect(getEnvVar('VITE_TEST_VAR')).toBe('hello');
    expect(getEnvVar('VITE_MISSING', 'default')).toBe('default');
    expect(() => getEnvVar('VITE_MISSING')).toThrow(/is not defined/);
  });
});
