import { expect, vi, describe, it, beforeEach } from 'vitest';
import { reviewRequirements, setAiClient, fetchJiraRequirement, createGithubIssue, generateTestCases, executeTests, __resetRateLimiter, initAi } from '../services/geminiService';
import { persistenceService } from '../services/persistenceService';
import { mcpService } from '../services/mcpService';
import { agentMemory } from '../services/memoryService';
import { logger } from '../utils/logger';
import { sanitizeRequirements } from '../utils/sanitizeInput';
import { WorkflowStatus } from '../types';

describe('Services Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    setAiClient(undefined);
    vi.stubEnv('VITE_GEMINI_API_KEY', 'test');
  });

  describe('geminiService', () => {
    beforeEach(() => {
        __resetRateLimiter();
    });

    it('handles rate limiting', async () => {
      vi.useFakeTimers();
      // Consume 10 tokens
      for (let i = 0; i < 10; i++) {
        // Mock a simple success to consume token
        setAiClient({ models: { generateContent: vi.fn().mockResolvedValue({ text: '{"specs":[]}' }) } } as any);
        await reviewRequirements('in');
      }
      // 11th should fail
      await expect(reviewRequirements('in')).rejects.toThrow('Rate limit exceeded');

      // Advance time to refill
      vi.advanceTimersByTime(61000);
      // Verify it works again
      await reviewRequirements('in');
      vi.useRealTimers();
    });

    it('extractText handles various formats', async () => {
        // Test with function text()
        setAiClient({ models: { generateContent: vi.fn().mockResolvedValue({ text: () => '{"specs":[]}' }) } } as any);
        await reviewRequirements('in');

        // Test with string text
        setAiClient({ models: { generateContent: vi.fn().mockResolvedValue({ text: '{"specs":[]}' }) } } as any);
        await reviewRequirements('in');

        // Test with nested candidates
        setAiClient({
            models: {
                generateContent: vi.fn().mockResolvedValue({
                    candidates: [{ content: { parts: [{ text: '{"specs":[]}' }] } }]
                })
            }
        } as any);
        await reviewRequirements('in');

        // Test failure case in extractText (catch block)
        setAiClient({
            models: {
                generateContent: vi.fn().mockResolvedValue({
                    get text() { throw new Error('fail'); }
                })
            }
        } as any);
        await reviewRequirements('in');

        // Test fallback return '' (line 80)
        setAiClient({
            models: {
                generateContent: vi.fn().mockResolvedValue({} as any)
            }
        } as any);
        await reviewRequirements('in');
    });

    it('handles missing API key warning', async () => {
        initAi(undefined);
        initAi('test-key');
    });

    it('handles tool calls and iterations', async () => {
        const mockGenerate = vi.fn()
            .mockResolvedValueOnce({ text: '{"thought": "using tool", "tool_call": {"name": "jira_search", "arguments": {"query": "test"}}}' })
            .mockResolvedValueOnce({ text: '{"specs": []}' });

        setAiClient({ models: { generateContent: mockGenerate } } as any);
        await reviewRequirements('in', { maxIterations: 2 });
        expect(mockGenerate).toHaveBeenCalledTimes(2);
    });

    it('handles workflow errors and missing client', async () => {
        setAiClient({ models: { generateContent: vi.fn().mockRejectedValue(new Error('API Error')) } } as any);
        const res = await reviewRequirements('in');
        expect(res.thinking).toContain('Error');

        setAiClient(undefined);
        await expect(reviewRequirements('in')).rejects.toThrow('GenAI client not initialized');
    });

    it('fetchJiraRequirement and createGithubIssue', async () => {
        const jira = await fetchJiraRequirement('KEY');
        expect(jira).toContain('JIRA SOURCE: KEY');
        const gh = await createGithubIssue('TC1', 'logs');
        expect(gh).toContain('github.com');
    });

    it('generateTestCases and executeTests', async () => {
        setAiClient({ models: { generateContent: vi.fn().mockResolvedValue({ text: '{"testCases":[]}' }) } } as any);
        await generateTestCases([]);

        setAiClient({ models: { generateContent: vi.fn().mockResolvedValue({ text: '{"results":[]}' }) } } as any);
        await executeTests([]);
    });
  });

  describe('persistenceService', () => {
    it('handles Supabase integration and failures', async () => {
        vi.stubEnv('VITE_SUPABASE_URL', 'http://s');
        vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'k');

        const fetchSpy = vi.spyOn(global, 'fetch')
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ state: { status: 'AGENT1_REVIEWING' } }]) } as any) // load
            .mockResolvedValueOnce({ ok: true } as any) // save
            .mockRejectedValueOnce(new Error('Network error')); // save fail

        let state = await persistenceService.loadState();
        expect(state?.status).toBe(WorkflowStatus.IDLE); // Sanitized

        // Load fail Supabase (empty data), fallback to LocalStorage
        vi.stubEnv('VITE_SUPABASE_URL', 'http://s');
        vi.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) } as any); // Empty data hits line 49 null branch
        localStorage.setItem('qa_nexus_state', JSON.stringify({ status: WorkflowStatus.IDLE }));
        state = await persistenceService.loadState();
        expect(state).toBeDefined();

        await persistenceService.saveToSupabase({ status: WorkflowStatus.IDLE } as any);
        await persistenceService.saveToSupabase({ status: WorkflowStatus.IDLE } as any); // Should fail but log error

        expect(fetchSpy).toHaveBeenCalledTimes(4);
    });

    it('loadFromLocalStorage handles errors', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('fail'); });
        expect(persistenceService.loadFromLocalStorage()).toBeNull();
    });

    it('saveState handles errors', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('fail'); });
        persistenceService.saveState({} as any);
    });

    it('clearState', () => {
        persistenceService.clearState();
    });

    it('loadFromSupabase returns null if config missing', async () => {
        vi.spyOn(persistenceService, 'getSBConfig').mockReturnValue({ url: '', key: '' });
        const res = await persistenceService.loadFromSupabase();
        expect(res).toBeNull();
    });
  });

  describe('mcpService', () => {
    it('handles various requests and errors', async () => {
        await mcpService.handleRequest({ jsonrpc: '2.0', method: 'tools/list', params: {}, id: 1 });
        await mcpService.handleRequest({ jsonrpc: '2.0', method: 'unknown', params: {}, id: 2 });

        // tools/call
        await mcpService.handleRequest({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: { name: 'jira_search', arguments: { query: 'test' } },
            id: 3
        });

        // Skill not found
        await mcpService.handleRequest({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: { name: 'non_existent', arguments: {} },
            id: 4
        });

        // Error handling
        await mcpService.handleRequest(null as any);

        expect(mcpService.getToolUsage()).toBeDefined();
    });
  });

  describe('memoryService', () => {
    it('handles max memories and clear', () => {
        agentMemory.clear();
        expect(agentMemory.getContext()).toBe("No previous session context.");

        for (let i = 0; i < 25; i++) {
            agentMemory.add('user', `msg ${i}`);
        }
        agentMemory.getContext();
        agentMemory.clear();
    });
  });

  describe('utils', () => {
    it('sanitizeRequirements handles long input', () => {
        const longInput = 'a'.repeat(60000);
        const sanitized = sanitizeRequirements(longInput);
        expect(sanitized.length).toBe(50000);
    });

    it('logger debug and info', () => {
        // Mock DEV mode
        vi.stubEnv('DEV', true);
        logger.debug('test');
        logger.info('test');

        vi.stubEnv('DEV', false);
        logger.debug('test');
        logger.info('test');
    });
  });
});
