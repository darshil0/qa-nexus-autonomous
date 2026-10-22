import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reviewRequirements, generateTestCases, executeTests, setAiClient } from '@/services/geminiService';

describe('Gemini Call-Site Prompt Hardening', () => {
  let capturedContents: string[] = [];

  beforeEach(() => {
    capturedContents = [];
    setAiClient({
      models: {
        generateContent: vi.fn().mockImplementation((args: { contents: string }) => {
          capturedContents.push(args.contents);
          return Promise.resolve({ text: '{"specs":[], "testCases":[], "results":[]}' });
        })
      }
    });
  });

  it('wraps user requirements in formatUntrustedInput delimiters during reviewRequirements', async () => {
    await reviewRequirements('User input requirement text');
    expect(capturedContents.length).toBeGreaterThan(0);
    expect(capturedContents[0]).toContain('=== BEGIN UNTRUSTED DATA (User Requirements Input) ===');
    expect(capturedContents[0]).toContain('User input requirement text');
    expect(capturedContents[0]).toContain('=== END UNTRUSTED DATA (User Requirements Input) ===');
  });

  it('wraps validated specs in formatUntrustedInput delimiters during generateTestCases', async () => {
    await generateTestCases([{
      requirementId: 'REQ-1',
      title: 'Login Spec',
      description: 'Spec desc',
      acceptanceCriteria: ['AC1'],
      riskClassification: 'Low',
      priority: 'P1',
      ambiguities: []
    }]);

    expect(capturedContents.length).toBeGreaterThan(0);
    expect(capturedContents[0]).toContain('=== BEGIN UNTRUSTED DATA (Validated Specs) ===');
    expect(capturedContents[0]).toContain('REQ-1');
    expect(capturedContents[0]).toContain('=== END UNTRUSTED DATA (Validated Specs) ===');
  });

  it('wraps test cases in formatUntrustedInput delimiters during executeTests', async () => {
    await executeTests([{
      id: 'TC-1',
      linkedRequirementIds: ['REQ-1'],
      category: 'Functional',
      preconditions: 'None',
      steps: ['Step 1'],
      expectedOutcomes: 'Pass',
      isAutomationCandidate: true
    }]);

    expect(capturedContents.length).toBeGreaterThan(0);
    expect(capturedContents[0]).toContain('=== BEGIN UNTRUSTED DATA (Test Cases to Execute) ===');
    expect(capturedContents[0]).toContain('TC-1');
    expect(capturedContents[0]).toContain('=== END UNTRUSTED DATA (Test Cases to Execute) ===');
  });
});
