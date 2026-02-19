
import { describe, it, expect } from 'vitest';
import { mcpService } from '@/services/mcpService';

describe('MCPService', () => {
  it('tools/list returns all 7 registered skills', async () => {
    const response = await mcpService.handleRequest({
      jsonrpc: '2.0',
      method: 'tools/list',
      params: {},
      id: 1
    });

    expect(response.result).toBeDefined();
    const result = response.result as { tools: unknown[] };
    expect(result.tools.length).toBe(7);
  });

  it('tools/call with jira_search returns a result containing the query string', async () => {
    const query = 'AUTH-101';
    const response = await mcpService.handleRequest({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'jira_search',
        arguments: { query }
      },
      id: 2
    });

    expect(response.result).toBeDefined();
    expect(typeof response.result).toBe('string');
    expect(response.result).toContain(query);
  });

  it('tools/call with an unknown skill name returns an error response with code -32601', async () => {
    const response = await mcpService.handleRequest({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'unknown_skill',
        arguments: {}
      },
      id: 3
    });

    expect(response.error).toBeDefined();
    expect(response.error?.code).toBe(-32601);
  });
});
