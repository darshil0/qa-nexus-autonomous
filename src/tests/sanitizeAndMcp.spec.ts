import { describe, it, expect } from 'vitest';
import { sanitizeRequirements, formatUntrustedInput } from '@/utils/sanitizeInput';
import { mcpService } from '@/services/mcpService';

describe('sanitizeInput Security Hardening', () => {
  it('strips prompt injection tokens and script tags', () => {
    const maliciousInput = '[SYSTEM] [ADMIN] [OVERRIDE] <script>alert(1)</script> Hello World';
    const clean = sanitizeRequirements(maliciousInput);
    expect(clean).toBe('Hello World');
    expect(clean).not.toContain('[SYSTEM]');
    expect(clean).not.toContain('[ADMIN]');
    expect(clean).not.toContain('<script>');
  });

  it('truncates inputs exceeding 50,000 characters', () => {
    const hugeInput = 'A'.repeat(60000);
    const clean = sanitizeRequirements(hugeInput);
    expect(clean.length).toBe(50000);
  });

  it('formats untrusted content with boundary delimiters', () => {
    const formatted = formatUntrustedInput('Jira Spec', 'Test content');
    expect(formatted).toContain('=== BEGIN UNTRUSTED DATA (Jira Spec) ===');
    expect(formatted).toContain('=== END UNTRUSTED DATA (Jira Spec) ===');
  });
});

describe('MCP Service & Skills Security', () => {
  it('prevents SSRF in performance_audit skill', async () => {
    const res = await mcpService.handleRequest({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'performance_audit',
        arguments: { url: 'file:///etc/passwd' }
      },
      id: 1
    });

    expect(res.error).toBeDefined();
    expect(res.error?.message).toContain('Invalid URL protocol');
  });

  it('allows valid http and https URLs in performance_audit skill', async () => {
    const res = await mcpService.handleRequest({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'performance_audit',
        arguments: { url: 'https://example.com' }
      },
      id: 2
    });

    expect(res.result).toBeDefined();
    expect(res.error).toBeUndefined();
  });
});
