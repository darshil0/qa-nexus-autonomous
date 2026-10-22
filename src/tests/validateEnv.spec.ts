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

  it('validates public env vars successfully', () => {
    expect(() => validateEnv()).not.toThrow();
  });

  it('logs warnings for optional placeholder env vars in dev mode', () => {
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
