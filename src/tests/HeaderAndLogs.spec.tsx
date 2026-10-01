import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '@/components/layout/Header';
import { AgentThinkingLog } from '@/components/layout/AgentThinkingLog';
import { TestCase, ExecutionResult, WorkflowStatus } from '@/types';

describe('Header & AgentThinkingLog', () => {
  const mockTestCases: TestCase[] = [
    {
      id: 'TC-1',
      linkedRequirementIds: ['REQ-1'],
      category: 'Functional',
      preconditions: 'None',
      steps: ['Step 1'],
      expectedOutcomes: 'Pass',
      isAutomationCandidate: true
    }
  ];

  const mockTestResults: ExecutionResult[] = [
    {
      testCaseId: 'TC-1',
      status: 'PASS',
      timestamp: '2026-10-01T12:00:00Z',
      logs: 'Pass'
    }
  ];

  describe('Header', () => {
    it('renders header elements correctly', () => {
      render(
        <Header
          activeTab="orchestrator"
          status={WorkflowStatus.IDLE}
          testCases={[]}
          results={[]}
        />
      );

      expect(screen.getByText('WORKSPACE')).toBeInTheDocument();
      expect(screen.getByText('ORCHESTRATOR')).toBeInTheDocument();
      expect(screen.getByText('STATUS: IDLE')).toBeInTheDocument();
    });

    it('displays error badge when error is present', () => {
      render(
        <Header
          activeTab="orchestrator"
          status={WorkflowStatus.FAILED}
          error="Network failure"
          testCases={[]}
          results={[]}
        />
      );

      expect(screen.getByText('Network failure')).toBeInTheDocument();
    });

    it('renders export buttons for agent2 when testCases exist', () => {
      render(
        <Header
          activeTab="agent2"
          status={WorkflowStatus.COMPLETED}
          testCases={mockTestCases}
          results={[]}
        />
      );

      const jsonBtn = screen.getByText('JSON');
      const csvBtn = screen.getByText('CSV');

      expect(jsonBtn).toBeInTheDocument();
      expect(csvBtn).toBeInTheDocument();

      fireEvent.click(jsonBtn);
      fireEvent.click(csvBtn);
    });

    it('renders export buttons for agent3/reports when results exist', () => {
      render(
        <Header
          activeTab="agent3"
          status={WorkflowStatus.COMPLETED}
          testCases={[]}
          results={mockTestResults}
        />
      );

      const jsonBtn = screen.getByText('JSON');
      const csvBtn = screen.getByText('CSV');

      expect(jsonBtn).toBeInTheDocument();
      expect(csvBtn).toBeInTheDocument();

      fireEvent.click(jsonBtn);
      fireEvent.click(csvBtn);
    });
  });

  describe('AgentThinkingLog', () => {
    it('renders default waiting state correctly when empty', () => {
      render(<AgentThinkingLog thinkingProcess="" />);
      expect(screen.getByText('Neural Engine Trace')).toBeInTheDocument();
      expect(screen.getByText('> Waiting for neural synchronization...')).toBeInTheDocument();
    });

    it('renders thinking process text when provided', () => {
      render(<AgentThinkingLog thinkingProcess="Agent 1: Analyzing input requirements..." />);
      expect(screen.getByText('Neural Engine Trace')).toBeInTheDocument();
      expect(screen.getByText('Agent 1: Analyzing input requirements...')).toBeInTheDocument();
    });
  });
});
