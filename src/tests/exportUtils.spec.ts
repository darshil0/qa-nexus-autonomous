import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  exportTestCasesJson,
  exportTestCasesCsv,
  exportResultsJson,
  exportResultsCsv
} from '@/utils/exportUtils';
import type { TestCase, ExecutionResult } from '@/types';

describe('exportUtils', () => {
  let createdLink: HTMLAnchorElement;
  let clickCount: number;

  beforeEach(() => {
    clickCount = 0;
    createdLink = document.createElement('a');
    createdLink.click = () => {
      clickCount++;
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      if (tagName === 'a') {
        return createdLink;
      }
      return document.createElement(tagName, options);
    });

    vi.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => {
      if (node === createdLink) {
        return createdLink;
      }
      return node;
    });

    vi.spyOn(document.body, 'removeChild').mockImplementation((node: Node) => {
      if (node === createdLink) {
        return createdLink;
      }
      return node;
    });

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockTestCases: TestCase[] = [
    {
      id: 'TC-1',
      linkedRequirementIds: ['REQ-1'],
      category: 'Functional',
      preconditions: 'User is on "login" page',
      steps: ['Step 1: Enter email', 'Step 2: Click "Submit"'],
      expectedOutcomes: 'User logged in "successfully"',
      isAutomationCandidate: true
    }
  ];

  const mockTestResults: ExecutionResult[] = [
    {
      testCaseId: 'TC-1',
      status: 'PASS',
      timestamp: '2026-10-01T12:00:00Z',
      logs: 'Executed step 1 "ok"',
      githubIssueUrl: 'https://github.com/issue/1'
    }
  ];

  it('exports test cases to JSON correctly', () => {
    exportTestCasesJson(mockTestCases);

    expect(createdLink.download).toContain('qa_nexus_test_cases_');
    expect(createdLink.download).toContain('.json');
    expect(createdLink.href).toBe('blob:mock-url');
    expect(clickCount).toBe(1);
  });

  it('exports test cases to CSV correctly', () => {
    exportTestCasesCsv(mockTestCases);

    expect(createdLink.download).toContain('qa_nexus_test_cases_');
    expect(createdLink.download).toContain('.csv');
    expect(createdLink.href).toBe('blob:mock-url');
    expect(clickCount).toBe(1);
  });

  it('exports execution results to JSON correctly', () => {
    exportResultsJson(mockTestResults);

    expect(createdLink.download).toContain('qa_nexus_execution_report_');
    expect(createdLink.download).toContain('.json');
    expect(createdLink.href).toBe('blob:mock-url');
    expect(clickCount).toBe(1);
  });

  it('exports execution results to CSV correctly', () => {
    exportResultsCsv(mockTestResults);

    expect(createdLink.download).toContain('qa_nexus_execution_report_');
    expect(createdLink.download).toContain('.csv');
    expect(createdLink.href).toBe('blob:mock-url');
    expect(clickCount).toBe(1);
  });

  it('handles empty data in exportTestCasesCsv and exportResultsCsv safely without downloading', () => {
    exportTestCasesCsv([]);
    expect(clickCount).toBe(0);

    exportResultsCsv([]);
    expect(clickCount).toBe(0);
  });
});
