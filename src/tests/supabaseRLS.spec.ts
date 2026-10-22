import { describe, it, expect, vi, beforeEach } from 'vitest';
import { persistenceService } from '@/services/persistenceService';
import { WorkflowStatus, WorkflowState } from '@/types';
import fs from 'node:fs';
import path from 'node:path';

describe('Supabase RLS & Authorization', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('verifies SQL migration file enables RLS and defines policies for qa_nexus_sessions', () => {
    const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/20260401000000_create_qa_nexus_sessions.sql');
    expect(fs.existsSync(migrationPath)).toBe(true);

    const sql = fs.readFileSync(migrationPath, 'utf-8');
    expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
    expect(sql).toContain('CREATE POLICY "Users can select own session data"');
    expect(sql).toContain('CREATE POLICY "Users can insert own session data"');
    expect(sql).toContain('CREATE POLICY "Users can update own session data"');
    expect(sql).toContain('CREATE POLICY "Users can delete own session data"');
  });

  it('handles authorization header propagation during saveToSupabase', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test_anon_key');

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => Promise.resolve({ success: true })
    } as Response);

    const mockState: WorkflowState = {
      rawRequirements: '',
      validatedSpecs: [],
      testCases: [],
      results: [],
      status: WorkflowStatus.IDLE,
      settings: { maxIterations: 3, temperature: 0.7, useFlashModel: false },
      metrics: {
        totalToolCalls: 0,
        averageLoopDepth: 0,
        totalTokensEstimated: 0,
        latencyMs: 0,
        toolFrequency: {},
        activeLoops: 0
      },
      thinkingProcess: ''
    };

    await persistenceService.saveToSupabase(mockState);

    expect(fetchSpy).toHaveBeenCalled();
    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://example.supabase.co/rest/v1/qa_nexus_sessions');
    expect(options.method).toBe('POST');
    const headers = options.headers as Record<string, string>;
    expect(headers['apikey']).toBe('test_anon_key');
    expect(headers['Authorization']).toBe('Bearer test_anon_key');
  });

  it('handles unauthenticated/failed response gracefully when saving/loading from Supabase', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'invalid_key');

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async (): Promise<unknown> => Promise.resolve([])
    } as Response);

    const loadedState = await persistenceService.loadFromSupabase();
    expect(loadedState).toBeNull();
  });
});
